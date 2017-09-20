var express = require('express');
var router = express.Router();
var log4js = require('../config/log4js');
var log = log4js.getLogger('routes.user');
var fs = require('fs');
var passport = require('passport');
var authorization = require('../controller/authorization')
var validator = require('../validate/user')
var userDB = require('../db/user');
var cardDB = require('../db/card');
var cardTypeDB = require('../db/cardType');
var deviceTokenDB = require('../db/deviceToken');
var User = require('../models').User;
var DeviceToken = require('../models').DeviceToken;
var PromiseError = require('../models').PromiseError;
var response = require('../models/response');
var fileManager = require('../util/fileManager');
var generator = require('../util/generator');
var upload = require('../util/uploader');
const Constant = require('../config/constant');
const ErrorCode = Constant.ErrorCode;
const path = require('path');
const mailer = require('../util/mailer');
const deviceTokener = require('../util/deviceTokener');


router.post('/login', validator.login, function(req, res, next) {
    passport.authenticate('local.login', function(err, user, info) {
        if (err || !user) {
            log.debug('err:', err)
            log.debug('user:', user)
            log.debug('info:', info)
            res.sendFailure(info.code, info.message);
        } else {
            log.debug('Sign In successs. (user:' + user.email + ')')      
            // We need call this method manually to configure a user session because the Express 4 not.
            // detail: https://github.com/jaredhanson/passport/issues/255
            req.login(user, function(err) {
                if (err) { 
                    log.warn('err:', err);
                    throw PromiseError(ErrorCode.SESSION_CANNOT_ESTABSLED, 'Oppss! Can not establed a session for user.');
                }
                log.debug('Establed session...OK');

                // link user <-> deviceToken
                var userId = user._id;
                var deviceToken = req.body.deviceToken;
                var client = req.body.client;
                var foundCard = undefined;

                return deviceTokener.addDeviceTokenIfNeed(userId, deviceToken, client)
                .then(function(added) {
                    return cardDB.find({ _id : user.cardId })
                })
                .then(function(card) {
                    if (!card) {
                        throw PromiseError(ErrorCode.CARD_NOT_FOUND, 'Not found card for this user. Please contact Adminitrator about this.')
                    }
                    foundCard = card
                    return cardTypeDB.findByType(card.type)
                })
                .then(function(cardType) {
                    if (!cardType) {
                        throw PromiseError(ErrorCode.CARD_TYPE_NOT_EXIST, 'Not found card type for this user. Please contact Administrator about this.')
                    }
                    return res.sendSuccess(200, user.asJson(foundCard, cardType));
                })
                .catch(function(e) {
                    next(e)
                });
            });
        }
    })(req, res, next);
});


router.post('/register', function(req, res, next) {
    upload('avatar').single('avatar')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.register, function(req, res, next) {
    var createdCard = undefined;
    var uploadFile = undefined;
    log.info('checking duplicate email: ' + req.body.email);
    return userDB.findByEmail(req.body.email)
        .then(function(user) {
            if (user) {
                throw PromiseError(ErrorCode.USER_DUPLICATED, 'User have already exist.');
            }
            return cardTypeDB.findAll()
        })
        .then(function(cardTypes) {
            if (!cardTypes || cardTypes.length == 0) {
                throw PromiseError(Constant.ErrorCode.CARD_TYPE_NOT_SETUP, 'ERROR: the system MUST BE have at least 1 card type. Please setup once (use POST /card/types).')
            }

            let defaultCardType = cardTypes[0]
            for (cardType in cardTypes) {
                if (cardType.is_default) {
                    defaultCardType = cardType
                    break
                }
            }

            log.info('generate new Card...');
            return cardDB.generateCardByType(defaultCardType.type);
        })
        .then(function(card) {
            if (!card) {
                throw PromiseError(ErrorCode.CARD_INSERT_FAIL, 'Can not generate new Card for user.');
            }
            createdCard = card
            log.debug('card: ', createdCard);

            var user = new User();
            user.email = req.body.email;
            user.password = user.encryptPassword(req.body.password);
            user.fullname = req.body.fullname;
            user.gender = req.body.gender;
            user.birthday = new Date(req.body.birthday);
            user.address = req.body.address;
            user.phone = req.body.phone;
            user.cardId = card._id;
            user.role = Constant.UserRole.Standard
            if (req.file) {
                user.avatar = generator.generateAvatarURL(req.file.filename, req);
                uploadFile = req.file.filename;
            }

            return userDB.add(user);
        })
        .then(function(user) {
            if (!user) {
                throw PromiseError(ErrorCode.USER_INSERT_FAIL, 'Register progress have a problem.');
            }

            log.debug('user: ', user);
            res.sendSuccess(201, user.asJson(createdCard));
        })
        .catch(function(e) {
            // rollback the created card
            if (createdCard) {
                cardDB.remove(createdCard);
            }
            // rollback the uploaded file
            if (uploadFile) {
                fileManager.removeAvatar(uploadFile);
            }
            log.error('error:', e);
            next(e);
        });
});


router.get('/', authorization.loggined, authorization.permission([Constant.ErrorCode.Admin]), validator.getAll, function(req, res, next) {
    var startTime = req.query.startTime || new Date();
    var forward = req.query.forward;
    var perPage = parseInt(req.query.perPage);

    if (forward === undefined) { forward = true }
    if (isNaN(perPage)) { perPage = 20 }

    var timeQuery = forward ? {$lt: startTime} : {$gt: startTime}
    var options = {
        limit: perPage,
        sort: {'created_at': -1}
    };
    var query = {
        created_at: timeQuery
    };

    return userDB.findAll(query, options)
    .then(function(users) {
        var result = users.map(function(item) {
            return item.asJson();
        });
        res.sendSuccess(200, result);
    })
    .catch(function(e) {
        next(e);
    })
});


router.put('/logout', authorization.loggined, validator.logout, function(req, res, next) {
    // clear device token
    deviceTokener.removeDeviceToken(req.user._id, req.body.deviceToken)
    // clear user session
    req.logout();
    res.sendSuccess(200, {});
});


router.put('/changePassword', authorization.loggined, validator.changePassword, function(req, res, next) {
    var userID = req.user._id;
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;
    return userDB.find({ _id: userID })
    .then(function(user) {
        if (!user) {
            throw PromiseError(ErrorCode.USER_NOT_EXIST, 'User not exist.');
        }
        if (!user.validPassword(oldPassword)) {
            throw PromiseError(ErrorCode.USER_INVALID_PASSWORD, 'User password not matched.')
        }
        user.password = user.encryptPassword(newPassword);
        return user.save();
    })
    .then(function() {
        res.sendSuccess(200, 'successs');
    })
    .catch(function(e) {
        next(e);
    });
});


router.put('/notification', authorization.loggined, validator.notification, function(req, res, next) {
    let allowed = req.body.allowed
    return userDB.update(req.user._id, {allowNotification: allowed})
    .then(function(user) {
        if (!user) {
            throw PromiseError(ErrorCode.USER_NOT_EXIST, 'User not exist.');
        }
        log.debug('updated user:', user)
        res.sendSuccess(200, {allowed: user.allowNotification});
    })
    .catch(function(e) {
        next(e);
    })
});


router.put('/validate', validator.email, function(req, res, next) {
    return userDB.findByEmail(req.body.email)
    .then(function(user) {
        if (user) {
            throw PromiseError(ErrorCode.USER_DUPLICATED, 'Email has already exist.');
        }
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e)
    })
});


router.put('/profile', authorization.loggined,  function(req, res, next) {
    upload('avatar').single('avatar')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.profile, function(req, res, next) {
    var avatarFileName = undefined
    var updatedUser = undefined
    var updated = {
        fullname: req.body.fullname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        address: req.body.address,
        phone: req.body.phone
    }
    if (req.file) {
        if (req.user.avatar && req.user.avatar.length > 0) {
            avatarFileName = path.basename(req.user.avatar);
        }
        updated.avatar = generator.generateAvatarURL(req.file.filename, req);
    }
    // we convert to json to remove `undefined` properties
    updated = JSON.parse(JSON.stringify(updated))
    log.debug('updated:', updated)

    return userDB.update(req.user._id, updated)
    .then(function(user) {
        updatedUser = user
        return cardDB.find({ _id: user.cardId })
    })
    .then(function(card) {
        log.debug('updated user:', updatedUser)
        // remove previous avatar if need
        if (avatarFileName && avatarFileName.length > 0) {
            fileManager.removeAvatar(avatarFileName)
        }
        res.sendSuccess(200, updatedUser.asJson(card))
    })
    .catch(function(e) {
        next(e)
    })
});


router.put('/forgetPassword', validator.forgetPassword, function(req, res, next) {
    
    var email = req.body.email
    var newPass = undefined

    return userDB.findByEmail(email)
    .then(function(user) {
        if (!user) {
            throw PromiseError(ErrorCode.USER_NOT_EXIST, 'Email not exist.');
        }

        newPassword = generator.generatePassword(8);
        var updated = {
            password: user.encryptPassword(newPassword)
        }

        log.debug('oldPass:', user.password)
        log.debug('newPass:', updated.password)

        return userDB.update(user._id, updated);
    })
    .then(function(user) {

        // send mail to user
        mailer.sendForgetPasswordEmail(user.email, newPassword);

        res.sendSuccess(200, 'successs.')
    })
    .catch(function(e) {
        next(e)
    })
});


router.delete('/:userId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), validator.remove, function(req, res, next) {
    var userId = req.params.userId;
    return userDB.findById(userId)
    .then(function(found) {
        if (!found) {
            throw PromiseError(ErrorCode.USER_NOT_EXIST, 'User not found.');
        }
        return userDB.removeById(userId)
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(ErrorCode.USER_DELETE_FAIL, 'User delete operation failure. Please try later.');
        }
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e);
    });
});


module.exports = router;

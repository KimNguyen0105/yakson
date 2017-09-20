var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var validator = require('../validate/news');
var authorization = require('../controller/authorization');
var newsDB = require('../db/news');
var News = require('../models/news');
var Like = require('../models/like');
var PromiseError = require('../models').PromiseError;
var uuidv4 = require('uuid/v4');
var log = require('../config/log4js').getLogger('routes.news');
var upload = require('../util/uploader');
var generator = require('../util/generator');
var fileManager = require('../util/fileManager');
var notification = require('../util/notification');
const Constant = require('../config/constant');
const ErrorCode = Constant.ErrorCode;


router.get('/', authorization.loggined, validator.getAll, function(req, res, next) {
    var user = req.user;
    var startTime = req.query.startTime || new Date();
    var forward = req.query.forward;
    var perPage = parseInt(req.query.perPage);

    if (forward === undefined) {
        forward = true;
    }
    if (isNaN(perPage)) {
        perPage = 20;
    }

    if (perPage <= 0) {
        return res.sendSuccess(200, []);
    }

    var timeQuery = forward ? {$lt: startTime} : {$gt: startTime}
    var options = {
        limit: perPage,
        sort: {'created_at': -1}
    };
    var query = {
        created_at: timeQuery
    };
    log.debug('query db:', query)
    return newsDB.findAll(query, options)
    .then(function(news) {

        return Promise.map(news, function(item) {
            let queries = {
                news_id: item._id
            }
            return Like.find(queries)
            .then(function(likes) {
                return item.asJson(likes, user._id);
            })
            .catch(function(e) {
                throw PromiseError(ErrorCode.LIKE_FAIL, e.message);
            })
        });

    })
    .then(function(news) {
        res.sendSuccess(200, news);
    })
    .catch(function(e) {
        next(e);
    })
});


router.post('/', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), function(req, res, next) {
    upload('news').single('photo')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.add, function(req, res, next) {
    
    var file = req.file;
    var item = {}
    item.title = req.body.title;
    item.description = req.body.description;
    if (file) {
        item.photo = generator.generateNewsURL(file.filename, req);
    }

    return newsDB.add(item)
    .then(function(item) {
        if (!item) {
            throw PromiseError(ErrorCode.NEWS_INSERT_FAIL, 'News could be not insert now. Please try later.')
        }
        notification.sendNews(item);
        res.sendSuccess(200, item.asJson());
    })
    .catch(function(e) {
        // clean upload photos if need
        if (file) {
            fileManager.removeNews(file.filename);
        }
        next(e)
    });
});


router.put('/:newsId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), function(req, res, next) {
    upload('news').single('photo')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.update, function(req, res, next) {
    
    var file = req.file;
    var newsId = req.params.newsId;
    var filepathToRemove = undefined;

    return newsDB.findById(newsId)
    .then(function(found) {
        if (!found) {
            throw PromiseError(ErrorCode.NEWS_NOT_EXIST, 'News not found.');
        }
        let updated = req.body;
        if (file) {
            filepathToRemove = found.photo
            updated.photo = generator.generateNewsURL(file.filename, req);
        }
        return newsDB.update(newsId, updated)
    })
    .then(function(item) {
        if (!item) {
            throw PromiseError(ErrorCode.NEWS_UPDATE_FAIL, 'News could be not update now. Please try later.')
        }
        res.sendSuccess(200, item.asJson());
    })
    .catch(function(e) {
        // clean upload photos if need
        if (file) {
            fileManager.removeNews(file.filename);
        }
        if (filepathToRemove && filepathToRemove.length) {
            fileManager.removeNewsFromPath(filepathToRemove);
        }
        next(e)
    });
});


router.delete('/:newsId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), validator.remove, function(req, res, next) {
    var newsId = req.params.newsId;
    return newsDB.find({ _id: newsId })
    .then(function(found) {
        if (!found) {
            throw PromiseError(ErrorCode.NEWS_NOT_EXIST, 'News not found.');
        }
        return newsDB.remove(newsId)
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(ErrorCode.NEWS_DELETE_FAIL, 'News delete operation failure. Please try later.');
        }
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e);
    });
});


router.put('/:newsId/like', authorization.loggined, validator.like, function(req, res, next) {
    var newsId = req.params.newsId;
    var like = req.body.like;
    var query = undefined;
    return newsDB.findById(newsId)
    .then(function(found) {
        log.debug('found news:', found)
        if (!found) {
            throw PromiseError(ErrorCode.NEWS_NOT_EXIST, 'News not found.');
        }
        query = {
            user_id: req.user._id,
            news_id: found._id
        }
        return Like.findOne(query)
    })
    .then(function(found) {
        log.debug('found likes:', found)
        if (like && !found) {
            // insert            
            log.debug('Insert a Like(user:%s, news:%s)', query.user_id, query.news_id);
            var item = new Like();
            item.user_id = query.user_id;
            item.news_id = query.news_id;
            return item.save().then(function(saved) {
                if (saved) {
                    return true
                }
                return false
            })
        }
        if (!like && found) {
            // remove
            log.debug('Remove the Like(user:%s, news:%s)', found.user_id, found.news_id);
            return Like.remove(found).then(function(deleted) {
                if (deleted.result.ok) {
                    return true
                }
                return false
            })
        }
        return true
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(ErrorCode.LIKE_FAIL, 'Oppsss! Like operation have a problem. Please try later.')
        }
        return Like.find({news_id: query.news_id});
    })
    .then(function(likes) {
        log.debug('likes.count:', likes.length)
        res.sendSuccess(200, {likedCount: likes.length});
    })
    .catch(function(e) {
        next(e);
    })
});


module.exports = router;

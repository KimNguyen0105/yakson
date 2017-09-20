var express = require('express');
var uuidv4 = require('uuid/v4');
var router = express.Router();
var Promise = require('bluebird');
var validator = require('../validate/history')
var authorization = require('../controller/authorization');
var historyDB = require('../db/history');
var userDB = require('../db/user');
var cardDB = require('../db/card');
var commentDB = require('../db/comment');
var History = require('../models/history');
var log = require('../config/log4js').getLogger('[route-history]');
var Constant = require('../config/constant');
var notification = require('../util/notification');
var PromiseError = require('../models').PromiseError;
var converter = require('../util/converter');


router.get('/', authorization.loggined, validator.getAll, function(req, res, next) {

    var startTime = req.query.startTime || new Date();
    var forward = req.query.forward;
    var perPage = parseInt(req.query.perPage);
    var userId = req.user._id;

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
        created_at: timeQuery,
        owner_id: userId
    };

    return historyDB.findAll(query, options)
    .then(function(histories) {
        return Promise.map(histories, function(item) {
            return commentDB.findByHistoryId(item._id)
                .then(function(comment) {
                    return item.asJson(comment);
                })
                .catch(function(e) {
                    log.debug('find comment for history(%s) error.', item._id, e)
                    return item.asJson();
                });
        });
    })
    .then(function(histories) {
        res.sendSuccess(200, histories);
    })
    .catch(function(e) {
        next(e);
    })
});


router.post('/', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), validator.add, function(req, res, next) {

    var ownerId = req.body.ownerId
    var targetUser = undefined
    var addedHistory = undefined
    var targetCash = undefined

    return userDB.find({ _id: ownerId })
    .then(function(user) {
        log.debug('found user:', user)
        if (!user) {
            throw PromiseError(Constant.ErrorCode.USER_NOT_EXIST, 'User not exist');
        }
        targetUser = user;

        return cardDB.findById(targetUser.cardId);
    })
    .then(function(card) {
        log.debug('found card:', card)
        if (!card) {
            throw PromiseError(Constant.ErrorCode.CARD_NOT_FOUND, 'Card not found.');
        }

        if (card.score < req.body.useScore) {
            throw PromiseError(Constant.ErrorCode.HISTORY_USE_SCORE_TOO_MUCH, 'The useScore is larger than the user score.')
        }
        targetCash = card;

        var history = new History()
        history.title = req.body.title;
        history.useScore = req.body.useScore;
        history.payCash = req.body.payCash;
        history.description = req.body.description;
        history.owner_id = targetUser._id;
        history.location = req.body.location;
        history.earnScore = converter.earnScoreFrom(req.body.useScore, req.body.payCash);
        return historyDB.add(history)
    })
    .then(function(history) {
        log.debug('added history:', history)
        if (!history) {
            throw PromiseError(Constant.ErrorCode.HISTORY_INSERT_FAIL, 'History could not insert now. Try again later.')
        }
        addedHistory = history;

        let score = targetCash.score + addedHistory.earnScore
        let spentCash = targetCash.spentCash + addedHistory.payCash
        let updated = {
            score: score,
            spentCash: spentCash
        }
        return cardDB.update(targetCash._id, updated);
    })
    .then(function(added) {
        log.debug('update card:', added)
        if (!added) {
            throw PromiseError(Constant.ErrorCode.USER_UPDATE_FAIL, 'Update score for user failure.');
        }
        if (targetUser && targetUser.allowNotification) {
            notification.sendHistory(addedHistory, ownerId);
        }
        res.sendSuccess(200, addedHistory.asJson());
    })
    .catch(function(e) {
        next(e)
    });
});


router.delete('/:historyId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), validator.remove, function(req, res, next) {
    var historyId = req.params.historyId;
    return historyDB.find({ _id: historyId })
    .then(function(found) {
        if (!found) {
            throw PromiseError(Constant.ErrorCode.HISTORY_NOT_EXIST, 'History not found.');
        }
        return historyDB.remove(historyId)
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(Constant.ErrorCode.HISTORY_DELETE_FAIL, 'History delete operation failure. Please try later.');
        }
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e);
    });
});


router.post('/:historyId/comment', authorization.loggined, validator.comment, function(req, res, next) {
    var historyId = req.params.historyId;
    var message = req.body.message;
    var history;
    return historyDB.find({ _id: historyId })
    .then(function(found) {
        if (!found) {
            throw PromiseError(Constant.ErrorCode.HISTORY_NOT_EXIST, 'History not found.');
        }
        history = found;

        let query = {
            user_id: req.user.id,
            history_id: historyId
        }

        return commentDB.find(query)
    })
    .then(function(found) {
        if (found) {
            throw PromiseError(Constant.ErrorCode.COMMENT_ALREADY_EXIST, 'History had already commented.');
        }

        let comment = {
            user_id: req.user.id,
            history_id: historyId,
            message: message
        }

        return commentDB.add(comment)
    })
    .then(function(added) {
        if (!added) {
            throw PromiseError(Constant.ErrorCode.COMMENT_INSERT_FAIL, 'Comment could not be insert now. Please try later.');
        }
        /** Maybe use later. */
        // res.sendSuccess(200, history.asJson(added));
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e);
    });
});


module.exports = router;

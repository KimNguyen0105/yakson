var express = require('express');
var router = express.Router();
var validator = require('../validate/promotion');
var authorization = require('../controller/authorization');
var promotionDB = require('../db/promotion');
var Promotion = require('../models/promotion');
var PromiseError = require('../models').PromiseError;
var uuidv4 = require('uuid/v4');
var log = require('../config/log4js').getLogger('[route-promotion]');
var upload = require('../util/uploader');
var generator = require('../util/generator');
var fileManager = require('../util/fileManager');
var notification = require('../util/notification');
const Constant = require('../config/constant');
const ErrorCode = Constant.ErrorCode;


router.get('/', authorization.loggined, validator.getAll, function(req, res, next) {

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
    log.debug('query options:', options)
    log.debug('query:', query)
    return promotionDB.findAll(query, options)
    .then(function(news) {
        var result = news.map(function(item) {
            return item.asJson();
        });
        res.sendSuccess(200, result);
    })
    .catch(function(e) {
        next(e);
    })
});


router.post('/', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), function(req, res, next) {
    upload('promotion').single('photo')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.add, function(req, res, next) {
    var file = req.file;
    var promotion = {}
    promotion.end_at = req.body.endAt;
    promotion.title = req.body.title;
    promotion.location = req.body.location;
    promotion.description = req.body.description;
    if (file) {
        promotion.photo = generator.generatePromotionURL(file.filename, req);
    }
    return promotionDB.add(promotion)
    .then(function(promotion) {
        if (!promotion) {
            throw PromiseError(ErrorCode.PROMOTION_INSERT_FAIL, 'Promotion could not insert now. Please try later.');
        }
        notification.sendPromotion(promotion);
        res.sendSuccess(200, promotion.asJson());
    })
    .catch(function(e) {
        // clean upload photos if need
        if (file) {
            fileManager.removePromotion(file.filename);
        }
        next(e)
    });
});


router.put('/:promotionId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), function(req, res, next) {
    upload('promotion').single('photo')(req, res, function(err) {
        if (err) {
            return next(PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, err.message));
        }
        next();
    });
}, validator.update, function(req, res, next) {
    var file = req.file;
    var promotionId = req.params.promotionId;
    var filepathToRemove = undefined;
    return promotionDB.findById(promotionId)
    .then(function(found) {
        if (!found) {
            throw PromiseError(ErrorCode.PROMOTION_NOT_EXIST, 'Promotion not found');
        }

        let updated = req.body
        updated.end_at = req.body.endAt;
        if (file) {
            filepathToRemove = found.photo;
            updated.photo = generator.generatePromotionURL(file.filename, req);
        }
        return promotionDB.update(promotionId, updated)
    })
    .then(function(promotion) {
        if (!promotion) {
            throw PromiseError(ErrorCode.PROMOTION_UPDATE_FAIL, 'Promotion could not update now. Please try later.');
        }
        res.sendSuccess(200, promotion.asJson());
    })
    .catch(function(e) {
        // clean upload photos if need
        if (file) {
            fileManager.removePromotion(file.filename);
        }
        // clean old Promotion
        if (filepathToRemove && filepathToRemove.length) {
            fileManager.removePromotionFromPath(filepathToRemove);
        }
        next(e)
    });
});


router.delete('/:promotionId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), validator.remove, function(req, res, next) {
    var promotionId = req.params.promotionId;
    return promotionDB.find({ _id: promotionId })
    .then(function(found) {
        if (!found) {
            throw PromiseError(ErrorCode.PROMOTION_NOT_EXIST, 'Promotion not found.');
        }
        return promotionDB.remove(promotionId)
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(ErrorCode.PROMOTION_DELETE_FAIL, 'Promotion delete operation failure. Please try later.');
        }
        res.sendSuccess(200, {});
    })
    .catch(function(e) {
        next(e);
    });
});


module.exports = router;

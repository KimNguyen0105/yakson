var express = require('express');
var router = express.Router();
var authorization = require('../controller/authorization');
var log = require('../config/log4js').getLogger('routes.card');
var CardType = require('../models/cardType');
var PromiseError = require('../models').PromiseError;
var uuidv4 = require('uuid/v4');
var upload = require('../util/uploader');
var validator = require('../validate/card');
var Constant = require('../config/constant');
var cardTypeDB = require('../db/cardType');
var generator = require('../util/generator');
var fileManager = require('../util/fileManager');


router.get('/types', authorization.loggined, function(req, res, next) {
    return cardTypeDB.findAll({})
    .then(function(types) {
        var result = types.map(function(item) {
            return item.asJson();
        });        
        res.sendSuccess(200, result);
    })
    .catch(function(e) {
        next(e)
    })
});


router.post('/types', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), upload('cardType').single('photo'), validator.addCardType, function(req, res, next) {
    
    let title = req.body.title;
    let description = req.body.description;
    let benefit = req.body.benefit;
    let type = req.body.type;
    let cashTarget = req.body.cashTarget;
    let is_default = req.body.default;
    let file = req.file;
    let createdCardType = undefined;

    return cardTypeDB.findByType(type)
    .then(function(matched) {
        if (matched) {
            throw PromiseError(Constant.ErrorCode.CART_TYPE_DUPLICATE, 'Card type have already exist.');
        }
        var cardType = {}
        cardType.title = title;
        cardType.description = description;
        cardType.benefit = benefit;
        cardType.type = type;
        cardType.cashTarget = cashTarget;
        cardType.is_default = is_default;
        if (file) {
            cardType.photo = generator.generateCardType(file.filename, req)
        }
        return cardTypeDB.add(cardType)
    })
    .then(function(saved) {
        if (!saved) {
            throw PromiseError(Constant.ErrorCode.CARD_TYPE_INSERT_FAIL, 'Cart type insert operation failure. Please try later.');
        }
        log.debug('new card type:', saved)
        createdCardType = saved
        /** set card type default if not exist */
        return cardTypeDB.findAll()
    })
    .then(function(cardTypes) {
        let defaultCardType = undefined
        for (cardType in cardTypes) {
            if (cardType.is_default) {
                defaultCardType = cardType
                break
            }
        }
        if (defaultCardType === undefined) {
            defaultCardType = cardTypes[0]
            defaultCardType.is_default = true
            return cardTypeDB.update(defaultCardType._id, defaultCardType);
        }
    })
    .then(function(defaultCardType) {
        if (defaultCardType) {
            log.debug('Just updated as DEFAULT cardType.', defaultCardType)
            if (defaultCardType._id.equals(createdCardType._id)) {
                createdCardType = defaultCardType
            }
        }
        log.debug('created cardType.', createdCardType)
        // response
        res.sendSuccess(200, createdCardType.asJson())
    })
    .catch(function(e) {
        // clean upload file
        if (file) {
            fileManager.removeCardType(file.filename);
        }
        next(e)
    });
});


router.put('/types/:cardTypeId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), upload('cardType').single('photo'), validator.updateCardType, function(req, res, next) {
    
    let filepathToRemove = undefined;
    let file = req.file;
    let cardTypeId = req.params.cardTypeId;

    return cardTypeDB.findById(cardTypeId)
    .then(function(found) {
        log.debug('found card type by id:', found)
        if (!found) {
            throw PromiseError(Constant.ErrorCode.CARD_TYPE_NOT_EXIST, 'Card type not exist.');
        }
        return cardTypeDB.findByType(req.body.type)
    })
    .then(function(matched) {
        log.debug('found card type by type:', matched)
        if (matched) {
            throw PromiseError(Constant.ErrorCode.CART_TYPE_DUPLICATE, 'Card type be duplicated.');
        }
        var updated = req.body
        if (file) {
            filepathToRemove = matched.photo
            updated.photo = generator.generateCardType(file.filename, req)
        }
        return cardTypeDB.update(cardTypeId, updated);
    })
    .then(function(updated) {
        log.debug('updated card type success:', updated)
        if (!updated) {
            throw PromiseError(Constant.ErrorCode.CARD_TYPE_UPDATE_FAIL, 'Cart type insert operation failure. Please try later.');
        }
        res.sendSuccess(200, updated.asJson())
    })
    .catch(function(e) {
        // clean upload file
        if (file) {
            fileManager.removeCardType(file.filename);
        }
        // clean old file
        if (filepathToRemove && filepathToRemove.length) {
            fileManager.removeCardTypeFromPath(filepathToRemove);
        }
        next(e)
    });
});


router.delete('/types/:cardTypeId', authorization.loggined, authorization.permission([Constant.UserRole.Admin]), function(req, res, next) {
    let cardTypeId = req.params.cardTypeId
    return cardTypeDB.findById(cardTypeId)
    .then(function(found) {
        if (!found) {
            throw PromiseError(Constant.ErrorCode.CARD_TYPE_NOT_EXIST, 'CardType not exist.')
        }
        return cardTypeDB.removeById(cardTypeId)
    })
    .then(function(success) {
        if (!success) {
            throw PromiseError(Constant.ErrorCode.CARD_TYPE_DELETE_FAIL, 'CardType could not delete not. Please try again.')
        }
        res.sendSuccess(200, {})
    })
    .catch(function(e) {
        next(e)
    })
})


module.exports = router;

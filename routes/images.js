var express = require('express');
var router = express.Router();
var log = require('../config/log4js').getLogger('[route-images]');
var path = require('path');
var fs = require('fs');
var Constant = require('../config/constant');
var fileManager = require('../util/fileManager');

router.get('/avatar/:filename', function(req, res, next) {
    var filename = req.params.filename
    fileManager.readAvatar(filename)
    .then(function(result) {
        if (result.error) {
            throw result.error;
        }
        res.setHeader('Content-Type', 'image/*')
        res.send(result.data)
    })
    .catch(function(e) {
        next(e)
    });
});

router.get('/promotion/:filename', function(req, res, next) {
    var filename = req.params.filename
    fileManager.readPromotion(filename)
    .then(function(result) {
        if (result.error) {
            throw result.error;
        }
        res.setHeader('Content-Type', 'image/*')
        res.send(result.data)
    })
    .catch(function(e) {
        next(e)
    });
});

router.get('/news/:filename', function(req, res, next) {
    var filename = req.params.filename
    fileManager.readNews(filename)
    .then(function(result) {
        if (result.error) {
            throw result.error;
        }
        res.setHeader('Content-Type', 'image/*')
        res.send(result.data)
    })
    .catch(function(e) {
        next(e)
    });
});

router.get('/cardType/:filename', function(req, res, next) {
    var filename = req.params.filename
    fileManager.readCardType(filename)
    .then(function(result) {
        if (result.error) {
            throw result.error;
        }
        res.setHeader('Content-Type', 'image/*')
        res.send(result.data)
    })
    .catch(function(e) {
        next(e)
    });
});

module.exports = router;

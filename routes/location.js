var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var validator = require('../validate/news');
var authorization = require('../controller/authorization');
var Location = require('../models/location');

var PromiseError = require('../models').PromiseError;
var uuidv4 = require('uuid/v4');
var log = require('../config/log4js').getLogger('routes.news');
var upload = require('../util/uploader');
var generator = require('../util/generator');
var fileManager = require('../util/fileManager');
var notification = require('../util/notification');
const Constant = require('../config/constant');
const ErrorCode = Constant.ErrorCode;


router.get('/', authorization.loggined, validator.getAll, function (req, res, next) {
    var user = req.user;
    Location.find({}, function (err, loc) {
        if (err) res.send(err);
        else {
            res.status(200).send(JSON.stringify({
                success: true,
                data:loc,
                errorCode:''
            }));
        }
    });
});


// router.post('/', authorization.loggined, validator.getAll, function (req, res, next) {
//     var location = new Location(req.body);
//     location.save(function(err,data){
//         if (err)
//             res.send(err);
//         res.status(200).send(JSON.stringify({
//             success: true,
//             data: data,
//             errorCode: '',
//         }));
//     })
// });





module.exports = router;

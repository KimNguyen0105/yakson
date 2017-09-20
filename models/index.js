var User = require('./user');
var Card = require('./card');
var CardType = require('./cardType');
var Promotion = require('./promotion');
var News = require('./news');
var History = require('./history');
var DeviceToken = require('./deviceToken');
var Constant = require('../config/constant');
var UserAdmin = require('./useradmin');
var About = require('./about');
var Features = require('./features');
var Process = require('./process');
var Info = require('./info');
var Menu = require('./menu');



var PromiseError = function(code, message, status) {
    var httpStatus = status || 200
    return { code: code, message: message, status: httpStatus, class: 'PromiseError' }
}

module.exports = {
    User: User,
    Card: Card,
    CardType: CardType,
    Promotion: Promotion,
    News: News,
    History: History,
    DeviceToken: DeviceToken,
    PromiseError: PromiseError
}
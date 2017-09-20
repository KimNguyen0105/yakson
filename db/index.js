var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('config');
var options = { promiseLibrary: require('bluebird'), useMongoClient: true };
mongoose.connect(config.database.host, options);

var User = require('./user');
var Card = require('./card');
var Promotion = require('./promotion');
var History = require('./history');
var Comment = require('./comment');
var Like = require('./like');
var DeviceToken = require('./deviceToken');
var Base = require('./base');
var Location = require('./location');


module.exports = {
   User: User,
   Card: Card,
   Promotion: Promotion,
   History: History,
   Comment: Comment,
   Like: Like,
   DeviceToken: DeviceToken,
   Location:Location
}
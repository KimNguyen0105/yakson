var Promise = require('bluebird');
var models = require('../models');
var PromiseError = models.PromiseError;
var ErrorCode = require('../config/constant').ErrorCode;
var uuidv4 = require('uuid/v4');
var Base = require('./base');
var base = new Base('deviceToken');


var find = function(conditions) {
    return base.find(conditions)
}

var findAll = function(conditions) {
    return base.findAll(conditions)
}

var add = function(deviceToken) {
    return base.add(deviceToken)
}

var update = function(id, updated) {
    return base.update(id, updated)
}

var remove = function(userId, deviceToken) {
    return base.remove({ userId: userId, deviceToken: deviceToken });
}

var removeByDeviceToken = function(deviceToken) {
    return base.remove({deviceToken: deviceToken});
}


module.exports = {
    find: find,
    findAll: findAll,
    add: add,
    remove: remove,
    removeByDeviceToken: removeByDeviceToken,
    update: update
}

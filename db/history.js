var models = require('../models');
var ErrorCode = require('../config/constant').ErrorCode;
var History = models.History;
var PromiseError = models.PromiseError;
var log = require('log4js').getLogger('db.history');

var find = function(conditions) {
    return History.findOne(conditions)
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var findAll = function(conditions, options) {
    return History.find(conditions, undefined, options)
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var add = function(history) {
    return history.save()
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var remove = function(historyId) {
    return History.remove({ _id: historyId })
    .then(function(deleted) {
        if (deleted.result.ok) {
            return true
        }
        return false
    })
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

module.exports = {
    find: find,
    findAll: findAll,
    add: add,
    remove: remove
}

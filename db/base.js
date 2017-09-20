var Constant = require('../config/constant');
var PromiseError = require('../models').PromiseError;
var log = require('../config/log4js').getLogger('db.base');

var Base = function(modelName) {
    let path = '../models/' + modelName
    this.Model = require(path);
    log.info('Load %s - OK', path);
}

Base.prototype.find = function(conditions) {
    return this.Model.findOne(conditions)
    .catch(function(err) {
        throw PromiseError(Constant.ErrorCode.DB_FIND_NOT_FOUND, err.message);
    });
}

Base.prototype.findAll = function(conditions, options) {
    return this.Model.find(conditions, undefined, options)
    .catch(function(err) {
        throw PromiseError(Constant.ErrorCode.DB_FIND_NOT_FOUND, err.message);
    });
}

Base.prototype.add = function(info) {
    let model = new this.Model(info);
    return model.save()
    .catch(function(err) {
        throw PromiseError(Constant.ErrorCode.DB_INSERT_FAIL, err.message);
    });
}

Base.prototype.update = function(id, updated) {
    return this.Model.findByIdAndUpdate(id, updated, {new: true})
    .catch(function(err) {
        throw PromiseError(Constant.ErrorCode.DB_ERROR, err.message);
    });
}

Base.prototype.remove = function(conditions) {
    return this.Model.remove(conditions)
    .then(function(removed) {
        if (removed.result.ok) {
            return true
        }
        return false
    })
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}


module.exports = Base;

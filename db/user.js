var models = require('../models');
var ErrorCode = require('../config/constant').ErrorCode;
var User = models.User;
var PromiseError = models.PromiseError;

var find = function(conditions) {
    return User.findOne(conditions)
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var findByEmail = function(email) {
    let query = {
        email: email.toLowerCase()
    };
    return find(query);
}

var findById = function(id) {
    let query = {
        _id: id
    };
    return find(query);
}

var findAll = function(conditions) {
    return User.find(conditions)
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var add = function(user) {
    return user.save()
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var update = function(id, updated) {
    return User.findByIdAndUpdate(id, updated, {new: true})
    .catch(function(err) {
        throw PromiseError(ErrorCode.DB_ERROR, err.message);
    });
}

var removeById = function(id) {
    let conditions = {
        _id: id
    };
    return User.remove(conditions)
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

module.exports = {
    find: find,
    findAll: findAll,
    findByEmail: findByEmail,
    findById: findById,
    add: add,
    update: update,
    removeById: removeById
}

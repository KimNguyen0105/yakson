'use strict';

var Base = require('./base');
var base = new Base('cardType');


var find = function(conditions) {
    return base.find(conditions);
}

var findAll = function(conditions, options) {
    let opts = options
    if (!opts) {
        opts = {
            sort: {'type': 1}
        }
    }
    return base.findAll(conditions, opts);
}

var findByType = function(type) {
    let conditions = {
        type: type
    };
    return base.find(conditions);
}

var findById = function(cardTypeId) {
    let conditions = {
        _id: cardTypeId
    };
    return base.find(conditions);
}

var add = function(info) {
    return base.add(info);
}

var update = function(id, updated) {
    return base.update(id, updated);
}

var remove = function(conditions) {
    return base.remove(conditions);
}

var removeById = function(cardTypeId) {
    let conditions = {
        _id: cardTypeId
    }
    return base.remove(conditions);
}


module.exports = {
    find: find,
    findAll: findAll,
    findByType: findByType,
    findById: findById,
    add: add,
    update: update,
    remove: remove,
    removeById: removeById
}

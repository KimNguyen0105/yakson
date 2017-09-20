'use strict'

var Base = require('../db/base');
var base = new Base('news');

var find = function(conditions) {
    return base.find(conditions)
}

var findAll = function(conditions, options) {
    return base.findAll(conditions, options)
}

var findById = function(newsId) {
    let conditions = {
        _id: newsId
    };
    return base.find(conditions)
}

var add = function(news) {
    return base.add(news)
}

var remove = function(newsId) {
    let conditions = {
        _id: newsId
    }
    return base.remove(conditions)
}

var update = function(id, updated) {
    return base.update(id, updated);
}

module.exports = {
    find: find,
    findAll: findAll,
    findById: findById,
    add: add,
    remove: remove,
    update: update
}

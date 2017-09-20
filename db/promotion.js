var Base = require('../db/base');
var base = new Base('promotion');

var find = function(conditions) {
    return base.find(conditions);
}

var findAll = function(conditions, options) {
    return base.findAll(conditions, options);
}

var findById = function(promotionId) {
    let conditions = {
        _id: promotionId
    };
    return base.find(conditions);
}

var add = function(promotion) {
    return base.add(promotion);
}

var update = function(id, updated) {
    return base.update(id, updated);
}

var remove = function(promotionId) {
    let conditions = {
        _id: promotionId
    }
    return base.remove(conditions);
}

module.exports = {
    find: find,
    findAll: findAll,
    findById: findById,
    add: add,
    remove: remove,
    update: update
}

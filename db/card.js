'use strict';

var uuidv4 = require('uuid/v4');
var Base = require('./base');
var base = new Base('card');

var find = function(conditions) {
    return base.find(conditions);
}

var findAll = function(conditions) {
    return base.findAll(conditions);
}

var findByUUID = function(uuid) {
    let conditions = {
        uuid: uuid
    };
    return find(conditions);
}

var findById = function(id) {
    let conditions = {
        _id: id
    };
    return find(conditions);
}

var add = function(card) {
    return base.add(card);
}

var remove = function(cardId) {
    return base.remove(cardId);
}

var update = function(id, updated) {
    return base.update(id, updated);
}

var generateCardByType = function(cardType) {
    var card = {};
    card.uuid = uuidv4();
    card.type = 0;
    card.score = 0;
    card.spentCash = 0;
    if (cardType) {
        card.type = cardType;
    }
    return add(card);
}


module.exports = {
    find: find,
    findAll: findAll,
    findByUUID: findByUUID,
    findById: findById,
    generateCardByType: generateCardByType,
    remove: remove,
    update: update
}

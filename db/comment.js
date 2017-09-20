var Base = require('./base');
var base = new Base('comment');


var findByHistoryId = function(id) {
    let query = {
        history_id: id
    }
    return base.find(query);
}

var find = function(queries) {
    return base.find(queries);
}

var add = function(info) {
    return base.add(info);
}


module.exports = {
    findByHistoryId: findByHistoryId,
    add: add,
    find: find
}
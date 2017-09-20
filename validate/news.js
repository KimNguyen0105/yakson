var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false});
var log = require('../config/log4js').getLogger('[validate-news]');
var PromiseError = require('../models').PromiseError;
var ErrorCode = require('../config/constant').ErrorCode;
var response = require('../models/response');
var Promise = require('bluebird');
var base = require('../validate/base');


var getAll = function(req, res, next) {
    var schema = {
        'type': 'object',
        'properties': {        
            'startTime': {
                'type': 'string',
                'format': 'date-time'
            },
            'forward': {
                'type': 'boolean'
            },
            'perPage': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var body = req.query;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next();
    });
}

var add = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['title', 'description'],
        'properties': {        
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res)
        }
    })
    .then(function(passed) {
        if (passed) next();
    });
}


var update = function(req, res, next) {
    var schema = {
        'type': 'object',
        'properties': {        
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            }
        }
    };
    var paramSchema = {
        'type': 'object',
        'required': ['newsId'],
        'properties': {        
            'newsId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validate(req.params, paramSchema, res)
        }
    })
    .then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res)
        }
    })
    .then(function(passed) {
        if (passed) next();
    });
}


var remove = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['newsId'],
        'properties': {        
            'newsId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var body = req.params;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next();
    });
}

var like = function(req, res, next) {
    var paramSchema = {
        'type': 'object',
        'require': ['newsId'],
        'properties': {
            'newsId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var bodySchema = {
        'type': 'object',
        'require': ['like'],
        'properties': {
            'like': {
                'type': 'boolean',
            }
        }        
    }
    base.validate(req.params, paramSchema, res).then(function(passed) {
        if (passed) return base.validate(req.body, bodySchema, res);
    })
    .then(function(passed) {
        if (passed) next();
    });
}

module.exports = {
    getAll: getAll,
    add: add,
    remove: remove,
    like: like,
    update: update
}

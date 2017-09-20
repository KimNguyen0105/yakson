var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false});
var log = require('../config/log4js').getLogger('[validate-history]');
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
        'required': ['title', 'description', 'useScore', 'payCash', 'ownerId', 'location'],
        'properties': {        
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'useScore': {
                'type': 'integer'
            },
            'payCash': {
                'type': 'integer'
            },
            'ownerId': {
                'type': 'string'
            },
            'location': {
                'type': 'string'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res)
        }
    })
    .then(function(passed) {
        if (passed) next();
    });
};

var remove = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['historyId'],
        'properties': {        
            'historyId': {
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

var comment = function(req, res, next) {
    var paramSchema = {
        'type': 'object',
        'required': ['historyId'],
        'properties': {        
            'historyId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var bodySchema = {
        'type': 'object',
        'required': ['message'],
        'properties': {
            'comment': {
                'type': 'string'
            }
        }
    };
    base.validate(req.params, paramSchema, res).then(function(passed) {
        if (passed) return base.validate(req.body, bodySchema, res);
    })
    .then(function(passed) {
        if (passed) next();
    })
}


module.exports = {
    getAll: getAll,
    add: add,
    remove: remove,
    comment: comment
}

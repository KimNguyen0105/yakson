var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false});
var log = require('../config/log4js').getLogger('[validate-promotion]');
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
    base.validate(body, schema, req).then(function(passed) {
        if (passed) next();
    });
}

var add = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['title', 'description', 'location'],
        'properties': {        
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'location': {
                'type': 'string'
            },
            'endAt': {
                'type': 'string',
                'format': 'date-time'
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
            },
            'location': {
                'type': 'string'
            },
            'endAt': {
                'type': 'string',
                'format': 'date-time'
            }
        }
    };
    var paramsSchema = {
        'type': 'object',
        'required': ['promotionId'],
        'properties': {        
            'promotionId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validate(req.params, paramsSchema, res)
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
        'required': ['promotionId'],
        'properties': {        
            'promotionId': {
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


module.exports = {
    getAll: getAll,
    add: add,
    remove: remove,
    update: update
}

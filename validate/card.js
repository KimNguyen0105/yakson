var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false});
var log = require('../config/log4js').getLogger('validate.card');
var PromiseError = require('../models').PromiseError;
var ErrorCode = require('../config/constant').ErrorCode;
var response = require('../models/response');
var Promise = require('bluebird');
var base = require('../validate/base');


var addCardType = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['title', 'description', 'benefit', 'type', 'cashTarget'],
        'properties': {
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'benefit': {
                'type': 'string'
            },
            'type': {
                'type': 'integer'
            },
            'cashTarget': {
                'type': 'integer',
            },
            'default': {
                'type': 'boolean'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res);
        }
    })
    .then(function(passed) {
        if (passed) next();
    });
}

var updateCardType = function(req, res, next) {
    var schema = {
        'type': 'object',
        'properties': {
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'benefit': {
                'type': 'string'
            },
            'type': {
                'type': 'integer'
            },
            'cashTarget': {
                'type': 'integer',
            },
            'default': {
                'type': 'boolean'
            }
        }
    };
    var paramsSchema = {
        'type': 'object',
        'required': ['cardTypeId'],
        'properties': {
            'cardTypeId': {
                'type': 'string',
                'format': 'parsable-int'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validate(req.params, paramsSchema, res);
        }
    })
    .then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res);
        }
    })
    .then(function(passed) {
        if (passed) next();
    });
}


module.exports = {
    addCardType: addCardType,
    updateCardType: updateCardType
}

var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false, removeAdditional: true});
var log = require('../config/log4js').getLogger('VALIDATE');
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

var login = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['email', 'password'],
        'properties': {        
            'email': {
                'type': 'string',
                'format': 'email'
            },
            'password': {
                'type': 'string',
                'minLength': 8
            },
            'deviceToken': {
                'type': 'string'
            },
            'client': {
                'type': 'integer',
                'enum': [0, 1]
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) next()
    });
}

var register = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['email', 'password', 'fullname', 'gender', 'birthday', 'address'],
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email'
            },
            'password': {
                'type': 'string',
                'minLength': 8
            },
            'fullname': {
                'type': 'string',
                'minLength': 1
            },
            'gender': {
                'type': 'string',
                'enum': ['0','1']
            },
            'birthday': {
                'type': 'string',
                'format': 'date-time'
            },
            'address': {
                'type': 'string',
                'minLength': 1
            },
            'phone': {
                'type': 'string'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res);
        }
    })
    .then(function(passed) {
        if (passed) next()
    });
}

var profile = function(req, res, next) {
    var schema = {
        'type': 'object',
        'properties': {
            'fullname': {
                'type': 'string',
                'minLength': 1
            },
            'gender': {
                'type': 'string',
                'enum': ['0','1']
            },
            'birthday': {
                'type': 'string',
                'format': 'date-time'
            },
            'address': {
                'type': 'string',
                'minLength': 1
            },
            'phone': {
                'type': 'string'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res)
    .then(function(passed) {
        if (passed) {
            return base.validateSingleFile(req.file, res);
        }
    })
    .then(function(passed) {
        if (passed) next()
    });
}

var changePassword = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['oldPassword', 'newPassword'],
        'properties': {        
            'oldPassword': {
                'type': 'string',
                'minLength': 8
            },
            'newPassword': {
                'type': 'string',
                'minLength': 8
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next()
    });
};

var email = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['email'],
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next()
    });
};

var forgetPassword = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['email'],
        'properties': {        
            'email': {
                'type': 'string',
                'format': 'email'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next()
    });
}

var logout = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': [],
        'properties': {        
            'deviceToken': {
                'type': 'string'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next()
    });
}

var notification = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['allowed'],
        'properties': {
            'allowed': {
                'type': 'boolean'
            }
        }
    };
    var body = req.body;
    base.validate(body, schema, res).then(function(passed) {
        if (passed) next()
    });
}

var remove = function(req, res, next) {
    var schema = {
        'type': 'object',
        'required': ['userId'],
        'properties': {        
            'userId': {
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
    login: login,
    logout: logout,
    register: register,
    profile: profile,
    email: email,
    changePassword: changePassword,
    forgetPassword: forgetPassword,
    notification: notification,
    getAll: getAll,
    remove: remove
}

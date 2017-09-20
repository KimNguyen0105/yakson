var Ajv = require('ajv');
var ajv = new Ajv({allErrors: false, removeAdditional: true, jsonPointers: true});
var log = require('../config/log4js').getLogger('validate.base');
var PromiseError = require('../models').PromiseError;
var ErrorCode = require('../config/constant').ErrorCode;
var Promise = require('bluebird');
var response = require('../models/response');
var path = require('path');

// CONFIGURATION
ajv.addFormat('parsable-int', function(input) {
    try {
        var value = parseInt(input);
        return !isNaN(value);
    } catch (e) {
        return false;
    }
});


var validateSingleFile = function(file, res) {
    return new Promise(function(resolve, reject) {
        if (file && file.truncated) {
            log.debug('validate single file invalid.')
            responseWithError(PromiseError(ErrorCode.VALIDATE_FAIL, 'File be trancacted.'), res);
            resolve(false);
        } else {
            resolve(true);
        }
    })
};

var validate = function(body, schema, res) {
    return new Promise(function(resolve, reject) {
        log.debug('validating...', body);
        var validate = ajv.compile(schema);
        var valid = validate(body);
        if (!valid) {
            log.error('error.', validate.errors);
            log.warn('validation...ERROR. (error: %s)', ajv.errorsText(validate.errors));
            var err = PromiseError(ErrorCode.VALIDATE_FAIL, ajv.errorsText(validate.errors));
            // TODO: separate error code for each validate fields.
            let error = validate.errors[0];
            var error2 = promiseErrorFromAjvError(error);
            log.error('error2', error2);

            // responseWithError(err, res);
            responseWithError(error2, res);
            resolve(false);
        } else {
            resolve(true);
        }
    })
};

var responseWithError = function(e, res) {
    if (e.code && e.message) {
        res.send(response.failure(e.code, e.message));
    } else {
        res.send(response.failure(ErrorCode.UNKNOWN, e.message));
    }
}

function failureKeyword(error) {
    if (!error) {
        return undefined;
    }
    log.debug('get keyword for error.', error)
    if (error.keyword === 'required') {
        return error.params.missingProperty;
    }

    return path.basename(error.dataPath);
}


var errorsMap = {
    'password': PromiseError(ErrorCode.VALIDATE_PASSWORD, 'password field is not valid.'),
    'email': PromiseError(ErrorCode.VALIDATE_EMAIL, 'email field is not valid.'),
    'deviceToken': PromiseError(ErrorCode.VALIDATE_DEVICE_TOKEN, 'deviceToken field is not valid.'),
    'startTime': PromiseError(ErrorCode.VALIDATE_START_TIME, 'startTime field is not valid.'),
    'forward': PromiseError(ErrorCode.VALIDATE_FORWARD, 'forward field is not valid.'),
    'perPage': PromiseError(ErrorCode.VALIDATE_PER_PAGE, 'perPage field is not valid.'),
    'photo': PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, 'photo field is not valid.'),
    'avatar': PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, 'avatar field is not valid.'),
    'file': PromiseError(ErrorCode.VALIDATE_UPLOAD_FILE, 'upload file is not valid.'),
    'title': PromiseError(ErrorCode.VALIDATE_TITLE, 'title field is not valid.'),
    'description': PromiseError(ErrorCode.VALIDATE_DESCRIPTION, 'description field is not valid.'),
    'location': PromiseError(ErrorCode.VALIDATE_LOCATION, 'location field is not valid.'),
    'fullname': PromiseError(ErrorCode.VALIDATE_FULLNAME, 'fullname field is not valid.'),
    'gender': PromiseError(ErrorCode.VALIDATE_GENDER, 'gender field is not valid.'),
    'birthday': PromiseError(ErrorCode.VALIDATE_BIRTHDAY, 'birthday field is not valid.'),
    'address': PromiseError(ErrorCode.VALIDATE_ADDRESS, 'address field is not valid.'),
    'benefit': PromiseError(ErrorCode.VALIDATE_BENEFIT, 'benefit field is not valid.'),
    'type': PromiseError(ErrorCode.VALIDATE_TYPE, 'type field is not valid.'),
    'useScore': PromiseError(ErrorCode.VALIDATE_SCORE, 'score field is not valid.'),
    'payCash': PromiseError(ErrorCode.VALIDATE_SCORE, 'score field is not valid.'),
    'ownerId': PromiseError(ErrorCode.VALIDATE_USER_ID, 'ownerId field is not valid.'),
    'phone': PromiseError(ErrorCode.VALIDATE_PHONE, 'phone field is not valid.'),
    'allowed': PromiseError(ErrorCode.VALIDATE_ALLOWED, 'allowed field is not valid.'),
    'historyId': PromiseError(ErrorCode.VALIDATE_HISTORY, 'history query is not valid.'),
    'client': PromiseError(ErrorCode.VALIDATE_CLIENT, 'client query is not valid.'),
    'oldPassword': PromiseError(ErrorCode.VALIDATE_OLD_PASSWORD, 'client query is not valid.'),
    'newPassword': PromiseError(ErrorCode.VALIDATE_NEW_PASSWORD, 'client query is not valid.'),
    'like': PromiseError(ErrorCode.VALIDATE_LIKE, 'client query is not valid.')
}


function promiseErrorFromAjvError(error) {
    let key = failureKeyword(error);
    let result = errorsMap[key];
    if (result === undefined) {
        result = PromiseError(ErrorCode.VALIDATE_FAIL, 'Validation have a problem.');
    }
    result.message = ajv.errorsText([error]);
    return result;
}


module.exports = {
    validate: validate,
    validateSingleFile: validateSingleFile,
    responseWithError: responseWithError
}

const ErrorCode = require('../config/constant').ErrorCode;
const Constant = require('../config/constant');
const log = require('../config/log4js').getLogger('authorization');

const USER = 0;
const ADMIN = 1;
var permission = function(accessRole = []) {
    // FIXME: allow all user permission. remove below code when release.
    accessRole = [USER, ADMIN]

    return function(req, res, next) {
        if (req.isAuthenticated()) {
            if (accessRole && accessRole.indexOf(req.user.role) !== -1) {
                return next()
            }
            res.sendFailure(ErrorCode.HTTP_STATUS_403, 'Forbidden denied. You do not have permission call this API.');
        } else {
            res.sendFailure(ErrorCode.HTTP_STATUS_401, 'Unauthozied. You MUST BE login before call this API.');
        }
    }
}

var loggined = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendFailure(ErrorCode.HTTP_STATUS_401, 'Unauthozied. You MUST BE login before call this API.');
}

module.exports = {
    loggined: loggined,
    permission: permission
}

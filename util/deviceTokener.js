'use strict'

const deviceTokenDB = require('../db/deviceToken');
const DeviceToken = require('../models/deviceToken');
const log = require('../config/log4js').getLogger('util.deviceTokener');
const Constant = require('../config/constant');


var addDeviceTokenIfNeed = function(userId, token, client) {
    if (!validToken(token)) {
        log.debug('Invalid token. Stop add device token.')
        return Promise.resolve();
    }
    var query = {
        deviceToken: token
    };

    log.debug('Finding device token(%s)...', token);
    return deviceTokenDB.find(query)
    .then(function(matched) {
        let clientType = Constant.Client.iOS
        if (client !== undefined) {
            clientType = client
        }
        if (!matched) {
            log.debug('Map token(%s) <-> user(%s)', token, userId);
            var item = new DeviceToken()
            item.userId = userId;
            item.deviceToken = token;
            item.client = clientType;
            return deviceTokenDB.add(item)
        } else if (matched.userId != userId) {
            log.debug('Refresh token(%s) <-> user(%s), old user(%s)', token, userId, matched.userId)
            return deviceTokenDB.update(matched._id, { userId: userId, client: clientType })
        } else {
            log.debug('Device token had already exist. Skip adding.')
            return
        }
    });
}

var removeDeviceToken = function(userId, token) {
    return deviceTokenDB.remove(userId, token)
    .then(function(removed) {
        if (removed) {
            return true
        }
        return false
    })
    .catch(function(e) {
        log.error('remove device token error.', e)
        return false
    })
}

var validToken = function(token) {
    if (token && token.length > 0) {
        return true
    }
    return false
}

module.exports = {
    addDeviceTokenIfNeed: addDeviceTokenIfNeed,
    removeDeviceToken: removeDeviceToken,
    validToken: validToken
}
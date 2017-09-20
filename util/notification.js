'use strict'

var Promise = require('bluebird');
var Constant = require('../config/constant');
var tokenDB = require('../db/deviceToken');
var userDB = require('../db/user');
var log = require('log4js').getLogger('util.notification');
var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-emembership.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://emembership-346d8.firebaseio.com"
});

let FirebaseErrorCode = {
    TOKEN_INVALID:  "messaging/invalid-registration-token",
    TOKEN_NOT_REGISTERED: "messaging/registration-token-not-registered",
}

let options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}


var sendPromotion = function(promotion) {
    let info = {
        title: promotion.title,
        body: 'Now, we are having a new promotion at ' + promotion.location
    }
    return sends(Constant.NotificationType.Promotion, info);
}

var sendNews = function(news) {
    let info = {
        title: news.title,
        body: news.description
    }
    return sends(Constant.NotificationType.News, info);
}

var sendHistory = function(history, userId) {
    let info = {
        title: history.title,
        body: 'Thank for transaction at ' + history.location
    }
    return sends(Constant.NotificationType.History, info, userId);
}

var send = function(type, info, userId) {
    return tokenDB.findAll({ userId: userId })
    .then(function(tokens) {
        return Promise.map(tokens, function(token) {
            let payload = generatePayload(token.client, type, info)
            let deviceToken = token.deviceToken
            return {payload, deviceToken}
        })
    })
    .then(function(datas) {
        return Promise.map(datas, (data) => {
            return push(data.deviceToken, data.payload)
        })
    })
    .catch(function(e) {
        log.error('%s Error. ', userId, e);
        return e
    });
}


var sends = function(type, info, userId) {
    log.debug('Push notification START.');
    let conditions = {}
    if (userId) {
        conditions._id = userId
    }
    return userDB.findAll(conditions)
    .then(function(users) {
        let filter = users.filter((user) => {
            return user.allowNotification
        })
        return filter;
    })
    .then(function(filtered) {
        return Promise.map(filtered, (user) => {
            return send(type, info, user._id)
        })
    })
    .then(function() {
        log.debug('Push notification DONE.');
    })
    .catch(function(e) {
        log.error('Push notification error. ' + e);
        throw e
    })
}

function push(deviceToken, payload) {
    return admin
    .messaging()
    .sendToDevice(deviceToken, payload, options)
    .then(function(response) {
        let results = response.results;
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            let token = deviceToken;
            if (result.error) {
                switch (result.error.code) {
                    case FirebaseErrorCode.TOKEN_INVALID:
                    case FirebaseErrorCode.TOKEN_NOT_REGISTERED:
                        // remove token
                        tokenDB
                        .removeByDeviceToken(token)
                        .then(function(removed) {
                            if (removed) {
                                log.warn('[%s] - Removed OK', token);
                            } else {
                                log.warn('[%s] - Removed NG', token);
                            }
                        });
                        break;
                    default:
                        log.warn('[%s] - ERROR.\n', token, result.error.toJSON());
                        break;
                }
            } else {
                log.info('[%s] - SENT', token);
            }
        }
        return response
    })
}

function generatePayload(client, type, info) {
    let notification = {
        title: info.title,
        body: info.body,
        sound: 'default'
    };
    let payload = {
        data: {
            type: type
        }
    };
    switch (client) {
        case Constant.Client.iOS:
            payload.notification = notification
            break;
        case Constant.Client.Android:
            payload.data.title = notification.title
            payload.data.body = notification.body
            break;
        default:
            payload.notification = notification
            break;
    }
    return payload;
}


module.exports = {
    sendHistory: sendHistory,
    sendPromotion: sendPromotion,
    sendNews: sendNews
}

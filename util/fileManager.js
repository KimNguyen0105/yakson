const path = require('path')
const fs = require('fs')
const log = require('../config/log4js').getLogger('util-fileManager')
const Constant = require('../config/constant')

var removeAvatar = function(filename) {
    return removeFile(filename, Constant.Container.Avatar)
}

var removePromotion = function(filename) {
    return removeFile(filename, Constant.Container.Promotion)
}

var removePromotionFromPath = function(filepath) {
    let filename = path.basename(filepath)
    return removePromotion(filename)
}

var removeNews = function(filename) {
    return removeFile(filename, Constant.Container.News)
}

var removeNewsFromPath = function(filepath) {
    let filename = path.basename(filepath)
    return removeNews(filename)
}

var removeCardType = function(filename) {
    return removeFile(filename, Constant.Container.CardType)
}

var removeCardTypeFromPath = function(filepath) {
    let filename = path.basename(filepath)
    return removeCardType(filename)
}

var readAvatar = function(filename) {
    return readFile(filename, Constant.Container.Avatar)
}

var readPromotion = function(filename) {
    return readFile(filename, Constant.Container.Promotion)
}

var readNews = function(filename) {
    return readFile(filename, Constant.Container.News)
}

var readCardType = function(filename) {
    return readFile(filename, Constant.Container.CardType)
}

function removeFile(filename, relativePath) {
    return new Promise(function (resolve, reject) {
        try {
            var filepath = path.join(__dirname, '..', relativePath, filename)
            log.debug('removing file at: ', filepath)
            fs.unlinkSync(filepath)
            return resolve()
        } catch(e) {
            log.warn(e)
            return resolve(e)
        }
    });
}

function readFile(filename, relativePath) {
    return new Promise(function (resolve, reject) {
        var filepath = path.join(__dirname, '..', relativePath, filename)
        log.debug('reading file at: %s...', filepath)
        fs.readFile(filepath, function(err, data) {
            if (err) {
                log.debug('reading file at: %s...', filepath, err)
                return resolve({error: err, data: undefined});
            }
            log.debug('reading file at: %s...DONE', filepath)
            return resolve({error: undefined, data: data})
        })
    });
}

module.exports = {
    removeAvatar: removeAvatar,
    removePromotion: removePromotion,
    removeNews: removeNews,
    removeCardType: removeCardType,
    removePromotionFromPath: removePromotionFromPath,
    removeNewsFromPath: removeNewsFromPath,
    removeCardTypeFromPath: removeCardTypeFromPath,
    readNews: readNews,
    readAvatar: readAvatar,
    readPromotion: readPromotion,
    readCardType: readCardType
}
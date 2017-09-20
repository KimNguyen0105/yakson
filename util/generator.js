const path = require('path')
const Constant = require('../config/constant');
const generator = require('generate-password');


var generateAvatarURL = function(filename, req) {
    return generateURL(filename, 'images/avatar', req)
}

var generatePromotionURL = function(filename, req) {
    return generateURL(filename, 'images/promotion', req)
}

var generateNewsURL = function(filename, req) {
    return generateURL(filename, 'images/news', req)
}

var generateHistory = function(filename, req) {
    return generateURL(filename, 'images/history', req)
}

var generateCardType = function(filename, req) {
    return generateURL(filename, 'images/cardType', req)
}

var generatePassword = function(length) {
    return generator.generate({
        length: 10,
        numbers: true
    });
}

function generateURL(filename, folder, req) {
    var root = Constant.Host.BaseURL
    if (req) {
        root = req.protocol + '://' + req.get('host')
    }
    console.log('#####' + root);
    return path.format({
        root: 'ignored',
        dir: root + '/' + folder,
        base: filename
    })
    // return path.join(base, folder, filename)
}


module.exports = {
    generateAvatarURL: generateAvatarURL,
    generatePromotionURL: generatePromotionURL,
    generateNewsURL: generateNewsURL,
    generateHistory: generateHistory,
    generateCardType: generateCardType,
    generatePassword: generatePassword
}

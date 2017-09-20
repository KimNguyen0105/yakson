'use strict';
const nodemailer = require('nodemailer');
const Promise = require('bluebird');
var log = require('../config/log4js').getLogger('util-mailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: 'ios.hbbsolutions@gmail.com',
        accessToken: 'ya29.GlubBHR6Ez-lZHyNDWDZSs3Li_QYh1fV5a09uB0cotCp0DLmTVSvmyfRtN219m67XFX3e1uH533icFTu2atZ9qaamLEVALsAPpKLSluIzdXdLA4eiRNa4UJiJVb7',
        refreshToken: '1/mXFGsxOdSZRqxxK4xSTwQ51xAw5b8zH3tloV9JvzXW-8aCsaLspapwzvxqQTht7D',
        clientId: '1088177011257-oeegr4sunca7r964aiqk307jt4hijbh4.apps.googleusercontent.com',
        clientSecret: '_4XRVn8LI4Ab5tG9t78_ahqy',
        expires: 1484314697598
    }
});

var sendMail = function(mailOptions) {
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                log.warn(err);
                return resolve(false);
            }
            log.info('Message %s sent: %s', info.messageId, info.response);
            return resolve(true);
        });
    })
}

var sendForgetPasswordEmail = function(email, newPass) {
    var mailOptions = {
        from: '"HBB Solutions - Emembership system" <ios.hbbsolutions@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Forget password', // Subject line
        text: mailContent(email, newPass) // plain text body
    }
    return sendMail(mailOptions);
}

var mailContent = function(to, pass, options) {
    // let contents = []
    let message = 'Lets use below information for next login time. Thank you. \n' +
    'Email: ' + to + '\r' +
    'New password: ' + pass + '\n'
    return message;
}

module.exports = {
    sendMail: sendMail,
    sendForgetPasswordEmail: sendForgetPasswordEmail
}


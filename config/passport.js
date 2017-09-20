var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models').User;
var userDB = require('../db/user');
var log = require('../config/log4js').getLogger('PASSPORT');
var Const = require('../config/constant');
var ErrorCode = Const.ErrorCode;
var PromiseError = require('../models').PromiseError;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user) {
    done(err, user);
  });
});


passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
  userDB.find({ email: email.toLowerCase() })
  .then(function(user) {
    log.debug('email:', email)
    if (!user) {
      return done(null, false, PromiseError(ErrorCode.USER_NOT_EXIST, 'Incorrect email.'));
    }
    if (!user.validPassword(password)) {
      return done(null, false, PromiseError(ErrorCode.USER_INVALID_PASSWORD, 'Incorrect password.'));
    }
    return done(null, user);
  })
  .catch(function(e) {
    done(null, false, e.message);
  });
}));


module.exports = passport

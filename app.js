var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db/index');
var passport = require('./config/passport');
var router = express.Router();
const Constant = require('./config/constant');
var ErrorCode = Constant.ErrorCode;
var response = require('./models/response');
var PromiseError = require('./models').PromiseError;
var boolParser = require('express-query-boolean');
var config = require('config');
var log4js = require('./config/log4js');
var log = log4js.getLogger('app');
var port = 8000;
// routers
var index = require('./routes/index');
var users = require('./routes/users');
var promotions = require('./routes/promotions');
var news = require('./routes/news');
var images = require('./routes/images');
var card = require('./routes/card');
var history = require('./routes/history');
var location = require('./routes/location');



//var admin=require('./admin/routes/useradmin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('short'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boolParser());
app.use(cookieParser());

app.use(session({ 
    secret: 'hbbsolutions', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
//admin
app.use(express.static(path.join(__dirname, 'public')));
var path = require("path");
var multer  = require('multer');
var url=require('url');
app.set('views', path.join(__dirname, 'admin/views'));
app.use(express.static(__dirname + '/admin/public'));
var routes = require('./admin/routes/useradmin');

routes(app);
// var url="http://localhost:3000/";


// router configuration
app.use(function(req, res, next) {
    res.sendFailure = function(errCode, errMessage) {
        res.sendError(PromiseError(errCode, errMessage));
    };
    res.sendError = function(err /* PromiseError, Error, undefined */) {
        // parse property
        var code = Constant.ErrorCode.HTTP_STATUS_500;
        var message = err;

        if (err && err.class === 'PromiseError') {
            code = err.code;
            message = err.message;
        }

        if (err && err instanceof Error) {
            message = err.message;
        }

        var json = response.failure(code, message); //"<html> <title>Fuck YOU!!!! </title> </html>"
        log.error('RESPONSE:\n', json);
        res.status(200).send(json);
    };
    res.sendSuccess = function(httpCode, responseJson) {
        var status = httpCode || 200;
        var json = response.success(responseJson);
        res.status(status).send(json);
    };
    next();
})

app.use('/', index);
app.use('/users', users);
app.use('/promotion', promotions);
app.use('/news', news);
app.use('/images', images);
app.use('/card', card);
app.use('/history', history);
app.use('/location', location);

// app.set('http://loaclhost:3000/',url);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(PromiseError(Constant.ErrorCode.HTTP_STATUS_404, "404 - Not Found."));
});

// error handler
app.use(function(err, req, res, next) {
    log.error('-------- app.js error handler --------');
    log.error('ERROR:\n', err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // v2
    res.sendError(err);
    log.error('--------------------------------------');
});

process.env.site_url='http://localhost:8000';

app.listen(port);
module.exports = app;
// module.exports = url;

console.log('chay o '+port + process.env.site_url);

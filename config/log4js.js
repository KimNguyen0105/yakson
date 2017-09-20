'use strict'

var config = require('config');
var fs = require('fs');

/**
 * make a log directory, just in case it isn't there.
 */
try {
  fs.mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

var log4js = require('log4js');
var configuration = JSON.parse(fs.readFileSync('./config/log4js.json', 'utf8'));
configuration.categories.default.level = config.log.level;
log4js.configure(configuration);

var getLogger = function(name) {
    var log = log4js.getLogger(name)
    return log
}

module.exports = {
    getLogger: getLogger
}
var multer = require('multer');
var Constant = require('../config/constant');
var upload = function(dest) {
    var storePath = './uploads/'
    if (dest) {
        storePath += dest
    }
    return multer({
        dest: storePath,
        rename: function(field, filename) {
            filename = filename.replace(/\W+/g, '-').toLowerCase();
            return filename + '_' + Date.now();
        },
        limits: {
            files: 1,
            fileSize: 3 * 1024 * 1024 // in MB
        }
    });
}

module.exports = upload;
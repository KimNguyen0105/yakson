
var failure = function(code, message) {
    return { success: false, errorCode: code, errorMessage: message };
};

var success = function(json) {
    return { success: true, data: json };
};

module.exports = {
    failure: failure,
    success: success
}
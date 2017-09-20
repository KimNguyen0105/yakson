var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../config/constant');

var schema = new Schema({  
    message: String,
    history_id: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});

schema.pre('save', function(next) {
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // change the created_at field to current date if created_at doesn't exist.
    if (!this.created_at) {
            this.created_at = currentDate;
    }
    next();
});

schema.methods.asJson = function() {
    var json = {
        id: this._id,
        createdAt: this.created_at,
        updatedAt: this.updated_at
    };
    return json;
}

var Model = mongoose.model('Comment', schema);

module.exports = Model;

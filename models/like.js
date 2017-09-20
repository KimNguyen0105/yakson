var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../config/constant');
var path = require('path');

var schema = new Schema({  
  user_id: { type: String, require: true },
  news_id: { type: String, require: true},
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
    };
    return json;
}

var Like = mongoose.model('Like', schema);

module.exports = Like;

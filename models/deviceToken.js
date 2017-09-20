var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({  
  userId: { type: String, required: true },
  deviceToken: { type: String, required: true },
  client: { type: Number, required: true , default: 0},
  created_at: Date,
  updated_at: Date,
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
    };
    return json;
}

var Model = mongoose.model('DeviceToken', schema);

module.exports = Model;

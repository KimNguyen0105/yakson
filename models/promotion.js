var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({  
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  photo: String,
  created_at: Date,
  updated_at: Date,
  end_at: Date
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
        title: this.title,
        description: this.description,
        location: this.location,
        photo: this.photo,
        endAt: this.end_at,
        createdAt: this.created_at,
        updatedAt: this.updated_at
    };
    return json;
}

var Model = mongoose.model('Promotion', schema);

module.exports = Model;

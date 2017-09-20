var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({  
  uuid: { type: String, required: true, unique: true },
  type: { type: Number, required: true },
  score: { type: Number, default: 0 },
  spentCash: { type: Number, default: 0 },
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
      uuid: this.uuid,
      type: this.type,
      score: this.score,
      spentCash: this.spentCash,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
    return json;
}

var Card = mongoose.model('Card', schema);

module.exports = Card;

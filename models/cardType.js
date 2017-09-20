var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: { type: String, required: true } ,
  description: String,
  benefit: String,
  type: { type: Number, required: true, unique: true },
  photo: String,
  is_default: { type: Boolean, default: false },
  cashTarget: { type: Number, required: true },
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

schema.methods.asJson = function(wrapper) {
    var json = {
      id: this._id,
      title: this.title,
      description: this.description,
      benefit: this.benefit,
      type: this.type,
      photo: this.photo,
      default: this.is_default,
      cashTarget: this.cashTarget,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
    return json;
}

var Model = mongoose.model('CardType', schema);

module.exports = Model;

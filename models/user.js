var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Constant = require('../config/constant');
const path = require('path');

var userSchema = new Schema({  
  fullname: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  gender: { type: Number, default: 0 },
  birthday: Date,
  address: String,
  phone: String,
  avatar: String,
  created_at: Date,
  updated_at: Date,
  cardId: { type: String, required: true },
  allowNotification: { type: Boolean, default: true },
  role: { type: Number, default: Constant.UserRole.Standard }
});

userSchema.pre('save', function(next) {
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // change the created_at field to current date if created_at doesn't exist.
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.asJson = function(card, cardType) {
    var json = {
        id: this._id,
        email: this.email,
        fullname: this.fullname,
        gender: this.gender,
        birthday: this.birthday,
        address: this.address,
        phone: this.phone,
        avatar: this.avatar,
        allowNotification: this.allowNotification,
        role: this.role,
        createdAt: this.created_at,
        updatedAt: this.updated_at
    };
    if (card) {
      json.card = card.asJson();
      if (cardType) {
        json.card.title = cardType.title;
      }
    }
    return json;
}

var User = mongoose.model('User', userSchema);

module.exports = User;

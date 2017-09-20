var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({  
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: String,
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

schema.methods.asJson = function(likes, userId) {
    var json = {
        id: this._id,
        title: this.title,
        description: this.description,
        photo: this.photo,
        liked: false,
        likedCount: likes ? likes.length : 0,
        createdAt: this.created_at,
        updatedAt: this.updated_at
    };
    // update like information
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        let like = likes[i];
        if (like.user_id == userId) {
            json.liked = true;
            break;
        }
      }
    }
    return json;
}

var Model = mongoose.model('News', schema);

module.exports = Model;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../config/constant');

var schema = new Schema({  
    title: String,
    description: String,
    useScore: { type: Number, required: true },
    payCash: { type: Number },
    earnScore: { type: Number }, // earnScore = payCash/<xxx> - useScore
    owner_id: { type: String, required: true },
    location: { type: String, required: true },
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

schema.methods.asJson = function(comment) {
    var json = {
        id: this._id,
        title: this.title,
        description: this.description,
        useScore: this.useScore,
        payCash: this.payCash,
        earnScore: this.earnScore,
        location: this.location,
        ownerId: this.owner_id,
        createdAt: this.created_at,
        updatedAt: this.updated_at
    };
    if (comment) {
        json.comment = true;
        json.commentMessage = comment.message;
    } else {
        json.comment = false;
        json.commentMessage = "";
    }
    return json;
}

var Model = mongoose.model('History', schema);

module.exports = Model;

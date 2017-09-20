'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AboutSchema = new Schema({
    title: {
        type: String,
        required: "Nhâp tiêu đề"
    },
    description:{
        type: String,
        min:6,
        // required: "Nhâp nội dung",
    },
    photo: {
        type: String
    },
    type:{
        type: Number,
        min: 0, max: 1, default: 0
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    Updated_date: {
        type: Date,
        default: Date.now
    }
});
module.exports=mongoose.model('About', AboutSchema);
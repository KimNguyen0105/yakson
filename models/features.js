'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeaturesSchema = new Schema({
    title: {
        type: String,
        required: "Nhâp tiêu đề"
    },
    description:{
        type: String,
        min:6,
        // required: "Nhâp nội dung",
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
module.exports=mongoose.model('Features', FeaturesSchema);
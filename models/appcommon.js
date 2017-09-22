'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppCommonSchema = new Schema({
    title: {
        type: String,
        required: "Nhâp tiêu đề"
    },
    description:{
        type: String,
        min:6,
        // required: "Nhâp nội dung",
    },
    type:{
        type: Number,
        default: 0 //type=0: điều khoản app, type=1: giới thiệu công ty, type=2: giới thiệu app 
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
module.exports=mongoose.model('AppCommon', AppCommonSchema);
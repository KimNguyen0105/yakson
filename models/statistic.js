'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatisticSchema = new Schema({
    title: {
        type: String,
        required: "Nhập tiêu đề"
    },
    icon:{
        type: String,
        required: "Nhập icon hiển thị"
    },
    sort_order:{
        type: Number,
        required: "Nhập thứ tự hiển thị"
    },
    quantity:{
        type: String,
        required: "Nhập số liệu"
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports=mongoose.model('Statistic', StatisticSchema);
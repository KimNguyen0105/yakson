'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProcessSchema = new Schema({
    title: {
        type: String,
        required: "Nhâp tiêu đề"
    },
    icon: {
        type: String,
        required: "Nhâp icon"
    },
    sort_order: {
        type: Number,
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
module.exports=mongoose.model('Process', ProcessSchema);
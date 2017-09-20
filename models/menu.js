'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    title: {
        type: String,
        required: "Nhâp tiêu đề menu",
    },
    sort_order:{
        type: Number
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports=mongoose.model('Menu', MenuSchema);
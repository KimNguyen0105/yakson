'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
    address: {
        type: String,
        required: "Nhập tên địa chỉ" 
    },
    email:{
        type: String,
        required: "Nhập email",
    },
   
    phone: {
        type: String,
        required: "Nhập Số điện thoại",
    },
    facebook: {
        type: String,
        required: "Nhập link facebook",
    },
    twitter: {
        type: String,
        required: "Nhập link twitter",
    },
    google: {
        type: String,
        required: "Nhập link google plus",
    },
    linkedin: {
        type: String,
        required: "Nhập link linkedin",
    },
    printerest: {
        type: String,
        required: "Nhập link printerest",
    },
    linkAdroid: {
        type: String,
        required: "Nhập link tải cho Adroid",
    },
    linkIos: {
        type: String,
        required: "Nhập link tải cho Ios",
    },
    title_head: {
        type: String,
        required: "Nhập tiêu đề cho header",
    },
    title_download: {
        type: String,
        required: "Nhập tiêu đề cho tải ứng dụng",
    },
    title_footer: {
        type: String,
        required: "Nhập tiêu đề cho header",
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
module.exports=mongoose.model('Info', InfoSchema);
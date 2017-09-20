'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserAdminSchema = new Schema({
    username: {
        type: String,
        required: "Nhâp tên đăng nhập",
        min: 6
    },
    password:{
        type: String,
        min:6,
        required: "Nhâp mật khẩu",
    },
    status: {
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
module.exports=mongoose.model('UserAdmin', UserAdminSchema);
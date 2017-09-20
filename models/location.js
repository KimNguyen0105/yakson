var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name:
    {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    address:
    {
        type: String,
        required: true
    },
    country_id: {
        type: Number
    },
    hotline: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    map: {
        type: String
    },
    Open: {
        type: String,
        required: true
    },
    Close: {
        type: String,
        required: true
    },
    Created_at: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Location', LocationSchema);
const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    phone: {
        type:String,
        required:true,
        unique: true,
        min:10,
        max:10,
        lowercase: true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required:true,
        min:8,
        max:16
    },
    status: {
        type:String,
        default:"person"
    },
    profilePic: {
        type:String,
        default:"None.png"
    },
    score: {
        type:Number,
        default:0
    }
});

const user = mongoose.model('user',user_schema);

module.exports = user;
 
const mongoose = require('mongoose');
const {isEmail,isMobilePhone, isNumeric, isStrongPassword, isAlpha,} = require("validator");

const user_schema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        validate:[isAlpha,"The name must has only letters"],
        minlength: 2,
    },
    phone: {
        type:String,
        required:[true,"Please enter your phone number"],
        unique: [true,"This phone number is already used"],
        minlength:[10,"Phone number must has 10 numbers"],
        validate:[isMobilePhone,"please enter a valid phone number"],
        validate:[isNumeric,"Phone number must have just a number"],

    },
    email: {
        type:String,
        required:[true,"Please enter your email"],
        unique: [true,"this email is already in use"],
        lowercase: true,
        validate: [isEmail,"Please enter a valid email"],
    },
    password: {
        type:String,
        required:[true,"Please enter a password"],
        minlength:[8,"The minimum password length is 8"],
        validate:[isStrongPassword,"enter strong password"],
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
 
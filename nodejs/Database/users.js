const mongoose = require('mongoose');
const {user_schema} = mongoose;

const users = new user_schema({
    name: {type:String, require:true},
    phone: {type:String, require:true,unique: true,min:10,max:10},
    status: {type:String, default:"user"},
    email: {type:String, require:true,unique: true},
    password: {type:String, require:true,min:8,max:16},
    profilePic: {type:String, require:false},
    score: {type:Number, default:0}
});

const user = mongoose.model('user',users);

module.exports = user;

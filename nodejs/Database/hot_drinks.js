const mongoose = require('mongoose');
const {hot_schema} = mongoose;


const hot_drinks = new hot_schema({
    name: {type:String,require:true,unique: true},
    price:{type: Number,require:true},
    status: {type:String,default:"Available"},
    image: {type: String,require:true},
    givenScore: {type: Number,default:0}
})

const HotDrinks = mongoose.model('HotDrinks',hot_drinks);

module.exports(HotDrinks);
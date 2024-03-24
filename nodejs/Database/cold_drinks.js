const mongoose = require('mongoose');
const {cold_schema} = mongoose;

const cold_drinks = new cold_schema({
    name: {type:String,require:true,unique: true},
    price:{type: Number,require:true},
    status: {type:String,default:"Available"},
    image: {type: String,require:true},
    givenScore: {type: Number,default:0}
});

const ColdDrinks = mongoose.model('ColdDrinks',cold_drinks);

module.exports(ColdDrinks);
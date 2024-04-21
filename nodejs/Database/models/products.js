const mongoose = require('mongoose');
const {Schema} = mongoose;
const product_schema = new Schema({
    name: {type:String,require:true,unique: true},
    price:{type: Number,require:true},
    status: {type:String,default:"Available"},
    type:{type:String,require:true},
    image: {type: String,require:true},
    givenScore: {type: Number,default:0},
    description:{type: String,require:true,max: 350}
});

const Product = mongoose.model('Product',product_schema);

module.exports = Product;

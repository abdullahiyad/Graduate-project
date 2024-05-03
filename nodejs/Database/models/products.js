const mongoose = require('mongoose');
/* 

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    type: String,
    image: {
        data: Buffer,
        contentType: String
    }
});

*/
const product_schema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
        unique: true
    },
    price: {
        type: Number,
        require:true
    },
    status: {
        type:String,
        default:"Available"
    },
    type: {
        type:String,
        require:true
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    givenScore: {
        type: Number,
        default:0
    },
    description: {
        type: String,
        require:true
    }
});

const product = mongoose.model('Product',product_schema);

module.exports = product;
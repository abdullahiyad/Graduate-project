const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        data:Buffer,
        contentType:String,
    }
});
const imageModel = mongoose.model('Image', imageSchema);

module.exports = imageModel;

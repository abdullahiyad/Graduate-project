const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    data:Buffer,
    contentType:String,
});
const imageModel = mongoose.model('Image', imageSchema);

model.exports = imageModel;

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    picture: String,
    name: String,
    quantity: Number,
    price: Number,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
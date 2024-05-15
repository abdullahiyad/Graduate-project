const mongoose = require('mongoose');
const { isEmail } = require('validator');

const reservation_Schema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
    },
    userEmail: {
        type: String,
        unique: true,
        require: true,
        validate: isEmail,
    },
    state: {
        type: String,
        default: "pending",
    },
    resName: {
        type: String,
        require: true,
        minlength: 3,
    },
    phone: {
        type: String,
        require: true,
        minlength: 10,
    },
    NumPerson: {
        type: Number,
        require: true,
    },
    ReserveTime: [{
        date: {
            type: Date,
            min: Date.now(),
        },
        time: {
            type: Date,
            required: true
        }
    }],
    details: {
        type: String,
        require: false,
    },
});

module.exports = resSchema = mongoose.model('reservation',reservation_Schema);


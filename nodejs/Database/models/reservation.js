const mongoose = require('mongoose');
const { isEmail } = require('validator');

const reservationSchema = new mongoose.Schema({
    customer: {
        userName: {
            type: String,
            ref: 'User',
            required: true
        },
        userEmail: {
            type: String,
            ref: 'User',
            required: true
        }
    },
    state: {
        type: String,
        default: "pending",
    },
    resName: {
        type: String,
        required: true,
        minlength: 3,
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
    },
    numPerson: {
        type: Number,
        required: true,
    },
    reserveTime: [{
        newDate: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return value && value > Date.now();
                },
                message: props => `${props.value} should be a future date`
            }
        },
        newTime: {
            type: String,
            required: true
        }
    }],
    details: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Reservation', reservationSchema);

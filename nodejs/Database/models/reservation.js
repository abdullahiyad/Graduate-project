const mongoose = require('mongoose');

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
    details: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Reservation', reservationSchema);

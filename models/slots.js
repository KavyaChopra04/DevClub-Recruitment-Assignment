const mongoose = require('mongoose');
const Slot = mongoose.Schema({

    startTime: {type:Number, required:true},
    endTime: {type:Number, required:true},
    is_booked : {
        type: Boolean,
        default: false,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    place:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
});

const Booking = mongoose.model('Slot', Slot);
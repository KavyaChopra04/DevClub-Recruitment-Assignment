const mongoose = require('mongoose');
const Slot = mongoose.Schema({

    date: {
        type:String, 
        required:true
    },
    startTime: {
        type:String,
        required:true
    },
    endTime: {
        type:String,
        required:true
    },
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
    place_name:{
        type: String,
        required: true,
    },
    sport:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
    },
   
});

module.exports = mongoose.model("Slot", Slot);
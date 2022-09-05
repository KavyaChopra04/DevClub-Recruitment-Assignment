const mongoose = require('mongoose');
const Place = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    capacity:{
        type: Number,
        required: true,
    },
    sport:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport'
  },
});
module.exports = mongoose.model("Place", Place);
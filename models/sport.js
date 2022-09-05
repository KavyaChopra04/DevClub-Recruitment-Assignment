const mongoose = require('mongoose');
const Sport = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    inventory: [{
      equipment :{
        type: String,
      },
      count:{
        type: Number,
      }
    }]
  });
module.exports = mongoose.model("Sport", Sport);
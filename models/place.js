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
  reviews:[{
    text: {
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
    }
}]
});
module.exports = mongoose.model("Place", Place);
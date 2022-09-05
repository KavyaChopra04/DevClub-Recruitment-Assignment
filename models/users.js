const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    is_admin: {
      type: Boolean,
      default: false
    },
    is_staff: {
      type: Boolean,
      default: false
    },
    slots_booked: [{
      type: Date,
      slots : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }
      ]
    }]

  });
User.pre("save", async function(next) { //pre-save password hashing
    if (!this.isModified("password")) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
});
module.exports = mongoose.model("User", User);
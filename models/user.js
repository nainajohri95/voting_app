const mongoose = require("mongoose");

// Define the person schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },
  aadharCardNumber: {
    type: Number,
    require: true,
    unique: true,
  },
  password: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted:{
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

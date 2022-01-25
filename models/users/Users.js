const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    // required: true,
  },
  lName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAllow: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);

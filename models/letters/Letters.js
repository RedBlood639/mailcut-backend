const mongoose = require("mongoose");
const LetterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  plainText: {
    type: String,
    required: true,
  },
  htmlText: {
    type: String,
    required: true,
  },
  stateFlag: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      email: String,
    },
  ],
  unlikes: [{ email: String }],
});

module.exports = mongoose.model("letter", LetterSchema);

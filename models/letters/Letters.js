const mongoose = require("mongoose");
const LetterSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },

  to: {
    type: String,
    required: true,
  },

  from: {
    type: String,
    required: true,
  },
  // title: {
  //   type: String,
  //   required: true,
  // },
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
  date: {
    type: Date,
  },
  likes: [
    {
      email: { type: String },
    },
  ],
  unlikes: [{ email: { type: String } }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = mongoose.model("letter", LetterSchema);

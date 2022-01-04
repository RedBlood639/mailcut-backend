const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  letter_id: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  plainText: {
    type: String,
    required: true,
  },
  htmlText: {
    type: String,
    reqruied: true,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("comment", CommentSchema);

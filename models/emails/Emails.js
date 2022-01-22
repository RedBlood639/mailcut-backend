const mongoose = require("mongoose");
const EmailSchema = new mongoose.Schema({
  e_id: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  date: {
    type: Date,
  },
  snippet: {
    type: String,
  },
  html: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  likes: [String],
  unlikes: [String],
});

module.exports = mongoose.model("email", EmailSchema);

const mongoose = require("mongoose");
// const config = require('config');
// const db = config.get('mongoURI');
const mongoURL = "mongodb://api.madreply.com:27017/madreply";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

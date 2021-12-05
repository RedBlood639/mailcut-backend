// Import modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import Router
const userRouter = require("./routes/users/user.route");
const letterRouter = require("./routes/letters/letters.route");

const connectDB = require("./config/db");
const app = express();

app.use(express.json({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
app.use(
  cors({
    origin: ["https://madreply.com", "http://localhost:3000"],
  })
);

app.use("/user", userRouter);
app.use("/letter", letterRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

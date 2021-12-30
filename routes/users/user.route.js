const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const smtpTransport = require("nodemailer-smtp-transport");

const UserModel = require("../../models/users/Users");

const sendEmailVerify = async (email, uniqueString) => {
  const Transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: "webdream1108@gmail.com",
        pass: "dre@m0428",
      },
    })
  );

  let mailOptions;
  let sender = "madreply";
  mailOptions = {
    from: sender,
    to: email,
    subject: "Verify your email",
    html: `Press <a href=http://localhost:3000/verify/${uniqueString}> here </a> to verify your email. Thank you.`,
  };

  const temp = await Transport.sendMail(mailOptions)
    .then((res) => {
      return true;
    })
    .catch((e) => {
      return false;
    });
  return temp;
};

// @route  GET /user
// @desc   Get all user
// @access Public
router.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

// @route  Remove /user/:email
// @desc   Remove user
// @access Public
router.delete("/:email", async (req, res) => {
  const user = await UserModel.findOne({ email: req.params.email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await user.remove();
  return res.json({ success: "User removed" });
});

// @route  POST users/register
// @desc   Register user
// @access Public
router.post("/register", async (req, res) => {
  const reqData = req.body;

  try {
    const user = await UserModel.findOne({ email: reqData.email });
    if (user) {
      return res.status(400).json({ error: "The user already existed." });
    }

    const uniqueString = crypto.randomBytes(32).toString("hex");

    const newUser = new UserModel({
      // fName: reqData.fName,
      // lName: reqData.lName,
      email: reqData.email,
      password: reqData.password,
      isAllow: reqData.isAllow,
      token: uniqueString,
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(reqData.password, salt);

    await newUser.save();

    if (newUser.isAllow) {
      return res.json({ success: "You registered successful!" });
    } else {
      const emailsent = await sendEmailVerify(newUser.email, uniqueString);
      if (emailsent) {
        return res.json({
          success: "Please check your mailbox. Verify your email.",
        });
      } else {
        return res.status(500).send("Email Send Error!");
      }
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error1!" });
  }
});

// @route  POST users/login
// @desc   Login user
// @access Public
router.post("/login", async (req, res) => {
  const reqData = req.body;
  try {
    const user = await UserModel.findOne({ email: reqData.email });
    if (!user) {
      return res.status(400).json({ error: "Not registered" });
    }

    if (reqData.password) {
      const isMatch = await bcrypt.compare(reqData.password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Password incorrect." });
      }
    }

    const payload = {
      user: {
        email: user.email,
        // fName: user.fName,
        // lName: user.lName,
        isAllow: user.isAllow,
      },
    };

    jwt.sign(payload, "123456789", { expiresIn: 3600 }, (err, token) => {
      if (err) {
        throw err;
      }
      res.json({ token: "Bearer " + token });
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// @route  POST users/resend
// @desc   Resend verify
// @access Public
router.post("/resend/:email", async (req, res) => {
  const { email } = req.params;
  const uniqueString = crypto.randomBytes(32).toString("hex");

  const user = await UserModel.findOneAndUpdate(
    { email: email },
    { new: true },
    { token: uniqueString }
  );
  try {
    const emailsent = await sendEmailVerify(user.email, user.token);
    if (emailsent) {
      return res.json({
        success: "Please check your mailbox. Verify your email.",
      });
    } else {
      return res.status(500).json({ error: "Email Send Error!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Email Send Error!" });
  }
});

// @route  POST users/verify/:token
// @desc   Verify email
// @access Public
router.post("/verify/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const user = await UserModel.findOne({ token });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please resend verification request." });
    }

    user.isAllow = true;
    await user.save();

    return res.json({ success: "Your email is verified." });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

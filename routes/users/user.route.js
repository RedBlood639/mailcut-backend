const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs-extra");
// const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// const path = require("path");
const smtpTransport = require("nodemailer-smtp-transport");
const sendGridMail = require("@sendgrid/mail");
const SENDGRID_API_KEY =
  "SG.o_XiM7buQ_OnaRRlJz1BfAT0kPEXpIYj4RfdbbAqN8D16M21a95xJTwFtTd1p5yf4";

const UserModel = require("../../models/users/Users");
const getPath = require("../../utils/getPath");
// const TOKEN_PATH = path.join(__dirname, "../../token.json");

sendGridMail.setApiKey(SENDGRID_API_KEY);

const sendEmailVerify = async (email, body) => {
  console.log(email, body);
  return {
    personalizations: [
      {
        to: [
          {
            email: `${email}`,
          },
        ],
        cc: [
          {
            email: `${email}`,
          },
        ],
        bcc: [
          {
            email: `${email}`,
          },
        ],
      },
    ],
    from: "verify@madreply.com",
    subject: "Verify your email",
    text: "Press here to verify your email. Thank you.",
    html: body,
  };

  // const Transport = nodemailer.createTransport(
  //   smtpTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "hotgold0905@gmail.com",
  //       pass: "qhhmwouwjcgryjfj",
  //     },
  //   })
  // );
  // // GoldLion123:)
  // // qhhmwouwjcgryjfj
  // let mailOptions;
  // let sender = "Madreply <madreply@gmail.com>";
  // mailOptions = {
  //   from: sender,
  //   to: email,
  //   subject: "Verify your email",
  //   html: `Press <a href=http://madreply.com/verify/${uniqueString}> here </a> to verify your email. Thank you.`,
  // };

  // const temp = await Transport.sendMail(mailOptions)
  //   .then((res) => {
  //     return true;
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     return false;
  //   });
  // return temp;
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
  UserModel.findOneAndRemove({ email: req.params.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(user);
    }
  });
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
      fName: reqData.fName,
      lName: reqData.lName,
      email: reqData.email,
      password: reqData.password,
      isAllow: reqData.isAllow,
      token: uniqueString,
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(reqData.password, salt);

    if (newUser.isAllow) {
      await newUser.save();
      return res.json({ success: "You registered successful!" });
    } else {
      // const emailsent = await sendEmailVerify(newUser.email, uniqueString);
      // const emailsent =
      try {
        const body = `Press <a href=http://madreply.com/verify/${uniqueString}> here </a> to verify your email. Thank you.`;
        await sendGridMail.send(sendEmailVerify(newUser.email, body));
        return res.json({
          success: "Please check your mailbox. Verify your email.",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Email Send Error!" });
      }
      // if (emailsent) {
      //   await newUser.save();
      // } else {
      // }
    }
  } catch (err) {
    console.log(error);
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
        fName: user.fName,
        lName: user.lName,
        isAllow: user.isAllow,
      },
    };

    jwt.sign(payload, "123456789", { expiresIn: 36000 }, (err, token) => {
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
    // const emailsent = await sendEmailVerify(user.email, user.token);
    // if (emailsent) {
    //   return res.json({
    //     success: "Please check your mailbox. Verify your email.",
    //   });
    // } else {
    //   return res.status(500).json({ error: "Email Send Error!" });
    // }
    const body = `Press <a href=http://madreply.com/verify/${uniqueString}> here </a> to verify your email. Thank you.`;
    await sendGridMail.send(sendEmailVerify(user.email, body));
    return res.json({
      success: "Please check your mailbox. Verify your email.",
    });
  } catch (error) {
    console.log(error);
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

router.post("/logout", async (req, res) => {
  // console.log(TOKEN_PATH);

  const exists = await fs.exists(getPath(req.body.email));
  if (exists) {
    fs.unlink(getPath(req.body.email), (err) => {
      if (err) {
        res.json({ error: "Logout Failed" });
      } else {
        res.json({ success: "Logged out" });
      }
    });
  }
  res.json({ success: "Logged out" });
});

router.get("/forget/:email", async (req, res) => {
  const { email } = req.params;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ error: "You are not registered. Please Sign up now." });
  }

  try {
    const body = `Press <a href=http://madreply.com/resetpass/${user.uniqueString}> here </a> to reset your password. Thank you.`;
    await sendGridMail.send(sendEmailVerify(email, body));
    return res.json({
      success: "Please check your mailbox. Reset your Password.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Email Send Error!" });
  }
});

router.post("/resetpass", async (req, res) => {
  const { password, token } = req.body;
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  try {
    await UserModel.findOneAndUpdate(
      { token: token },
      { new: true },
      { password: newPassword }
    );
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Server Error!" });
  }
});

module.exports = router;

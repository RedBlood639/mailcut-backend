const express = require("express");
const gmail = require("../../functions/gmail-api");

const router = express.Router();

const EmailModel = require("../../models/emails/Emails");

/**
 * Route for getting gmail messageskobe66520

 */
router.post("/getMessages", async (req, res) => {
  try {
    const params = req.query;
    const messages = await gmail.getMessages(params);

    return res.json({ messages });
  } catch (e) {
    console.error(e);
    return res.json({ error: "Server Error" });
  }
});

router.post("/getMessage/:id", async (req, res) => {
  try {
    const messages = await gmail.getMessage({ messageId: req.params.id });

    return res.json({ messages });
  } catch (e) {
    console.error(e);
    return res.json({ error: "Server Error" });
  }
});

/**
 * Route for getting a specific attachment from a message
 */
router.get("/getAttachment", async (req, res) => {
  try {
    const attachmentId = req.query.attachmentId;
    const messageId = req.query.messageId;

    const attachment = await gmail.getAttachment({ attachmentId, messageId });

    return res.send({ attachment });
  } catch (e) {
    return res.send({ error: e });
  }
});

/**
 * Route for getting gmail mesages from a thread
 */
router.get("/getThread", async (req, res) => {
  try {
    const messageId = req.query.messageId;

    const messages = await gmail.getThread({ messageId });

    return res.send({ messages });
  } catch (e) {
    return res.send({ error: e });
  }
});

/**
 * Route for send a mail message
 */
router.post("/sendMessage", async (req, res) => {
  try {
    const { to, subject, text, attachments } = req.body;

    if (!to) {
      throw "Recipient email(s) is required";
    }

    await gmail.sendMessage({ to, subject, text, attachments });

    return res.json({ message: "Message sent!" });
  } catch (e) {
    console.log(e);
    return res.json({ error: "Server Error" });
  }
});

/**
 * Publish email
 */
router.post("/publish", async (req, res) => {
  try {
    const email = await EmailModel.findOne({ e_id: req.body.e_id });
    if (email) {
      return res
        .status(400)
        .json({ error: "You've already published this email." });
    }

    const newEmail = new EmailModel(req.body);

    await newEmail.save();
    return res.json({ success: "An Email is published successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;

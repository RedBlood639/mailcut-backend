const express = require("express");
const gmail = require("../../functions/gmail-api");

const router = express.Router();

/**
 * Route for getting gmail messageskobe66520

 */
router.get("/getMessages", async (req, res) => {
  try {
    const params = req.query;
    const messages = await gmail.getMessages(params);

    return res.send({ messages });
  } catch (e) {
    console.error(e);
    return res.send({ error: e });
  }
});

router.get("/getMessage/:id", async (req, res) => {
  try {
    const messages = await gmail.getMessage({ messageId: req.params.id });

    return res.send({ messages });
  } catch (e) {
    console.error(e);
    return res.send({ error: e });
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

    return res.send({ message: "Message sent!" });
  } catch (e) {
    return res.send({ error: e });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const EmailModel = require("../../models/emails/Emails");

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

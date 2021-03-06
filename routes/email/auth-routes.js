const express = require("express");
const auth = require("../../functions/gmail-auth");

const router = express.Router();

/**
 * Route for authenticate user, otherwise request a new token
 * prompting for user authorization
 */

router.get("/gmailAuth/:email", async (req, res) => {
  try {
    // const authenticated = await auth.authorize();

    // if not authenticated, request new token
    // if (!authenticated) {
    const authorizeUrl = await auth.getNewToken();
    return res.json(
      { authUrl: authorizeUrl }
      // `<script>window.open("${authorizeUrl}", "_blank");<script>`
    );
    // }

    // return res.send({ text: "Authenticated" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server Error!" });
  }
});

/**
 * Callback route after authorizing the app
 * Receives the code for claiming new token
 */
router.post("/oauth2Callback", async (req, res) => {
  try {
    // get authorization code from request\
    const { code, email } = req.body;
    const oAuth2Client = auth.getOAuth2Client();
    const result = await oAuth2Client.getToken(code);
    const tokens = result.tokens;
    await auth.saveToken(tokens, email);
    return res.json({ success: true });
  } catch (e) {
    console.log(e);
    return res.json({ error: true });
    // return res.send({ error: e });
  }
});

module.exports = router;

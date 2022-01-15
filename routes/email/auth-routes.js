const express = require("express");
const auth = require("../../functions/gmail-auth");

const router = express.Router();

/**
 * Route for authenticate user, otherwise request a new token
 * prompting for user authorization
 */
router.get("/gmailAuth", async (req, res) => {
  try {
    // const authenticated = await auth.authorize();

    // if not authenticated, request new token
    // if (!authenticated) {
    const authorizeUrl = await auth.getNewToken();
    return res.send(
      `<script>window.open("${authorizeUrl}", "_blank");<script>`
    );
    // }

    // return res.send({ text: "Authenticated" });
  } catch (e) {
    return res.send({ error: e });
  }
});

/**
 * Callback route after authorizing the app
 * Receives the code for claiming new token
 */
router.get("/oauth2Callback", async (req, res) => {
  try {
    // get authorization code from request
    const code = req.query.code;

    const oAuth2Client = auth.getOAuth2Client();
    const result = await oAuth2Client.getToken(code);
    const tokens = result.tokens;

    await auth.saveToken(tokens);

    console.log("Successfully authorized");
    return res.send("<script>window.close();</script>");
  } catch (e) {
    return res.send({ error: e });
  }
});

module.exports = router;

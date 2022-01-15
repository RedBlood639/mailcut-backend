const { google } = require("googleapis");
const fs = require("fs-extra");
const path = require("path");
const credentials = require("../config/credentials.json");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
];
const TOKEN_PATH = path.join(__dirname, "../token.json");

exports.authorize = async () => {
  // check if the token already exists
  const exists = await fs.exists(TOKEN_PATH);
  const token = exists ? await fs.readFile(TOKEN_PATH, "utf8") : "";

  if (token) {
    authenticate(JSON.parse(token));
    return true;
  }

  return false;
};

exports.getNewToken = async () => {
  const oAuth2Client = getOAuth2ClientFunction();

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
};

exports.saveToken = async (token) => {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
};

exports.getOAuth2Client = () => {
  return getOAuth2ClientFunction();
};

const getOAuth2ClientFunction = () => {
  const GOOGLE_CLIENT_ID = credentials.web.client_id;
  const GOOGLE_CLIENT_SECRET = credentials.web.client_secret;
  const GOOGLE_CALLBACK_URL = credentials.web.redirect_uris[0];

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
  );

  return oAuth2Client;
};

const authenticate = (token) => {
  const oAuth2Client = getOAuth2ClientFunction();

  oAuth2Client.setCredentials(token);
  google.options({
    auth: oAuth2Client,
  });
};

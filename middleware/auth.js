const auth = require("../functions/gmail-auth");
const jwt = require("jsonwebtoken");
const config = require("config");

export const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ error: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const authenticated = await auth.authorize();
    if (!authenticated) {
      throw "No Authenticated";
    }
    next();
  } catch (e) {
    res.status(401);
    res.send({ error: e });
  }
};

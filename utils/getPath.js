const path = require("path");

module.exports = getPath = (email) => {
  return path.join(__dirname, "../token_" + email + ".json");
};

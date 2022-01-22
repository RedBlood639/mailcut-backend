const path = require("path");

module.exports = getPath = (email) => {
  return path.join(__dirname, "../tokens/token_" + email + ".json");
};

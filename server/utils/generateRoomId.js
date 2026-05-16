const crypto = require("crypto");

const generateRoomId = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = generateRoomId;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,

  otp: String,
  otpExpiry: Date,

  skillsOffered: [String],
  skillsWanted: [String],

  bio:String,
  
  likedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
skippedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

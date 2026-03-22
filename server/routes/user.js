const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET profile
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// UPDATE profile
router.put("/profile", auth, async (req, res) => {
  const { name, skillsOffered, skillsWanted, bio } = req.body;

  const user = await User.findById(req.user.id);

  user.name = name;
  user.skillsOffered = skillsOffered;
  user.skillsWanted = skillsWanted;
  user.bio = bio;

  await user.save();

  res.json(user);
});

module.exports = router;
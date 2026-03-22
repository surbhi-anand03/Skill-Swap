const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const {
  requestOtp,
  verifyOtp,
  register,
  login,
  forgotPasswordOtp,
  resetPassword
} = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);      // ✅ new
router.post("/register", register);  

router.post("/login", login);

router.post("/forgot-password/request-otp", forgotPasswordOtp);
router.post("/forgot-password/verify-otp", resetPassword);

// GET PROFILE
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, skillsOffered, skillsWanted, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.bio = bio || user.bio;

    await user.save();

    res.json({ message: "Profile updated", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

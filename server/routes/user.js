const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const {
  likeUser,
  skipUser
} = require("../controllers/userController");


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

// 🔥 GET MATCHED USERS (DISCOVER)
router.get("/match", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    console.log("CURRENT USER:", currentUser._id);
    console.log("LIKED:", currentUser.likedUsers);
    console.log("SKIPPED:", currentUser.skippedUsers);


    const excludedUsers = [
      ...currentUser.likedUsers,
      ...currentUser.skippedUsers,
      req.user.id
    ];

    const users = await User.find(
      { _id: { $nin: excludedUsers } },
      "-password -otp -otpExpiry -__v"
    );

const processedUsers = users.map((user) => {
  const currentWanted = currentUser.skillsWanted || [];
  const currentOffered = currentUser.skillsOffered || [];

  const userOffered = user.skillsOffered || [];
  const userWanted = user.skillsWanted || [];

  const offeredMatch = userOffered.filter(skill =>
    skill && currentWanted
      .map(s => s?.toLowerCase())
      .includes(skill.toLowerCase())
  ).length;

  const wantedMatch = userWanted.filter(skill =>
    skill && currentOffered
      .map(s => s?.toLowerCase())
      .includes(skill.toLowerCase())
  ).length;

  // ✅ REAL match score
  const matchScore = offeredMatch + wantedMatch;

  // ✅ max possible score
  const maxScore = currentWanted.length + currentOffered.length;

  // ✅ percentage
  const matchPercentage =
    maxScore === 0 ? 0 : Math.round((matchScore / maxScore) * 100);

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.otp;
  delete userObj.otpExpiry;
  delete userObj.__v;

  return {
    ...userObj,
    matchScore,
    matchPercentage,
  };
});

    // 🔥 Separate users
    const matchedUsers = processedUsers
      .filter(user => user.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    const nonMatchedUsers = processedUsers
      .filter(user => user.matchScore === 0);

    // logs
    console.log("======== MATCHED USERS ========");
    console.log(matchedUsers);

    console.log("======== NON-MATCHED USERS ========");
    console.log(nonMatchedUsers);

    // ✅ FINAL RESPONSE
    res.json({
      recommended: matchedUsers,
      allUsers: nonMatchedUsers,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❤️ LIKE
router.post("/like/:id", auth, likeUser);

// ❌ SKIP
router.post("/skip/:id", auth, skipUser);


module.exports = router;
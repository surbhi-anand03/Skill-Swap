const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Request = require("../models/Request");
const {
  getAllUsers,
  likeUser,
  skipUser,
  updateProfile
} = require("../controllers/userController");

// GET all users
router.get("/all",  auth, getAllUsers);


// GET profile
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// UPDATE Profile

router.put("/profile", auth, updateProfile);

const mongoose = require("mongoose"); // ← add at top of file if not there

router.get("/discover", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId);

    const requests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // ✅ Build set of all interacted user IDs (as strings)
    const relatedUserIds = new Set();
    requests.forEach((r) => {
      relatedUserIds.add(r.sender.toString());
      relatedUserIds.add(r.receiver.toString());
    });

    relatedUserIds.delete(userId);
    
    // ✅ Convert strings → ObjectIds for $nin
    const relatedIdsAsObjectIds = Array.from(relatedUserIds).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // ✅ Filter at DB level
   
    const users = await User.find({
      _id: { $nin: relatedIdsAsObjectIds }
    });

    const normalize = (arr) => (arr || []).map((s) => s.toLowerCase().trim());
    const currentOffered = normalize(currentUser.skillsOffered);
    const currentWanted = normalize(currentUser.skillsWanted);

    const processedUsers = users.map((user) => {
      const otherOffered = normalize(user.skillsOffered);
      const otherWanted = normalize(user.skillsWanted);

      const offeredMatchCount = otherOffered.filter((skill) =>
        currentWanted.includes(skill)
      ).length;

      const wantedMatchCount = otherWanted.filter((skill) =>
        currentOffered.includes(skill)
      ).length;

      const swapScore = offeredMatchCount * 2 + wantedMatchCount * 2;

      return {
        ...user.toObject(),
        swapScore,
        requestStatus: null,
        requestId: null,
        isSender: false,
      };
    });

    processedUsers.sort((a, b) => b.swapScore - a.swapScore);

    res.json({
      recommended: processedUsers.filter((u) => u.swapScore > 0),
      allUsers: processedUsers.filter((u) => u.swapScore === 0),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❤️ LIKE
router.post("/like/:id", auth, likeUser);

// ❌ SKIP
router.post("/skip/:id", auth, skipUser);


router.get("/matches", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "name email skillsOffered skillsWanted bio")
      .populate("receiver", "name email skillsOffered skillsWanted bio");

    const uniqueMatches = [];
    const seen = new Set();

    requests.forEach((r) => {
      const otherUser =
        r.sender._id.toString() === userId
          ? r.receiver
          : r.sender;

      if (!seen.has(otherUser._id.toString())) {
        seen.add(otherUser._id.toString());
        uniqueMatches.push(otherUser);
      }
    });

res.json(uniqueMatches);
  } catch (err) {
    console.error("MATCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
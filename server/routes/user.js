// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const User = require("../models/User");
// const { getAllUsers } = require("../controllers/userController");
// const Request = require("../models/Request");

// // GET all users
// router.get("/all", getAllUsers);

// const {
//   likeUser,
//   skipUser
// } = require("../controllers/userController");


// // GET profile
// router.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// });

// // UPDATE profile
// router.put("/profile", auth, async (req, res) => {
//   const { name, skillsOffered, skillsWanted, bio } = req.body;

//   const user = await User.findById(req.user.id);

//   user.name = name;
//   user.skillsOffered = skillsOffered;
//   user.skillsWanted = skillsWanted;
//   user.bio = bio;

//   await user.save();

//   res.json(user);
// });

// // 🔥 GET MATCHED USERS (DISCOVER)
// router.get("/match", auth, async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user.id);

//     console.log("CURRENT USER:", currentUser._id);
//     console.log("LIKED:", currentUser.likedUsers);
//     console.log("SKIPPED:", currentUser.skippedUsers);

//     // ❌ DO NOT exclude liked/skipped users (to keep cards visible)
//     const excludedUsers = [req.user.id];

//     const users = await User.find(
//       { _id: { $nin: excludedUsers } },
//       "-password -otp -otpExpiry -__v"
//     );

//     // ✅ NORMALIZE FUNCTION (FIXES BUG)
//     const normalize = (arr) =>
//       (arr || []).map(s => s?.toLowerCase().trim());

//     const currentOffered = normalize(currentUser.skillsOffered);
//     const currentWanted = normalize(currentUser.skillsWanted);

//     const processedUsers = users.map((user) => {
//       const otherOffered = normalize(user.skillsOffered);
//       const otherWanted = normalize(user.skillsWanted);

//       // ✅ MATCH COUNTS
//       const offeredMatchCount = otherOffered.filter(skill =>
//         currentWanted.includes(skill)
//       ).length;

//       const wantedMatchCount = otherWanted.filter(skill =>
//         currentOffered.includes(skill)
//       ).length;

//       // ✅ PERFECT MATCH (fixes Surbhi-Srushti issue)
//       const isPerfectMatch =
//         offeredMatchCount > 0 && wantedMatchCount > 0;

//       // ✅ SWAP SCORE (for ranking)
//       const swapScore =
//         offeredMatchCount * 2 + wantedMatchCount * 2;

//       // ✅ MATCH %
//       const maxScore =
//         currentWanted.length + currentOffered.length;

//       const matchPercentage =
//         maxScore === 0
//           ? 0
//           : Math.round(((offeredMatchCount + wantedMatchCount) / maxScore) * 100);

//       const userObj = user.toObject();

//       delete userObj.password;
//       delete userObj.otp;
//       delete userObj.otpExpiry;
//       delete userObj.__v;

//       return {
//         ...userObj,
//         swapScore,
//         matchPercentage,
//         isPerfectMatch,
//       };
//     });

//     // ✅ SORT BY SWAP SCORE
//     processedUsers.sort((a, b) => b.swapScore - a.swapScore);

//     // ✅ SEPARATE USERS
//     const recommended = processedUsers.filter(
//       (u) => u.swapScore > 0
//     );

//     const allUsers = processedUsers.filter(
//       (u) => u.swapScore === 0
//     );

//     // 🔍 DEBUG LOGS
//     console.log("======== RECOMMENDED ========");
//     console.log(recommended);

//     console.log("======== OTHERS ========");
//     console.log(allUsers);

//     // ✅ FINAL RESPONSE (same structure as your frontend expects)
//     res.json({
//       recommended,
//       allUsers,
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/discover", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const users = await User.find({ _id: { $ne: userId } });

//     const currentUser = await User.findById(userId);

//     const requests = await Request.find({
//       $or: [{ sender: userId }, { receiver: userId }],
//     });

//     const normalize = (arr) =>
//       (arr || []).map(s => s.toLowerCase().trim());

//     const currentOffered = normalize(currentUser.skillsOffered);
//     const currentWanted = normalize(currentUser.skillsWanted);

//     const processedUsers = users.map((user) => {
//       const otherOffered = normalize(user.skillsOffered);
//       const otherWanted = normalize(user.skillsWanted);

//       const offeredMatchCount = otherOffered.filter(skill =>
//         currentWanted.includes(skill)
//       ).length;

//       const wantedMatchCount = otherWanted.filter(skill =>
//         currentOffered.includes(skill)
//       ).length;

//       const swapScore =
//         offeredMatchCount * 2 + wantedMatchCount * 2;

//       const reqData = requests.find(
//         (r) =>
//           (r.sender.toString() === userId &&
//             r.receiver.toString() === user._id.toString()) ||
//           (r.receiver.toString() === userId &&
//             r.sender.toString() === user._id.toString())
//       );

//       return {
//         ...user.toObject(),
//         swapScore,
//         requestStatus: reqData ? reqData.status : null,
//         isSender: reqData
//           ? reqData.sender.toString() === userId
//           : false,
//       };
//     });

//     processedUsers.sort((a, b) => b.swapScore - a.swapScore);

//     res.json({
//       recommended: processedUsers.filter(u => u.swapScore > 0),
//       allUsers: processedUsers.filter(u => u.swapScore === 0),
//     });


//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ❤️ LIKE
// router.post("/like/:id", auth, likeUser);

// // ❌ SKIP
// router.post("/skip/:id", auth, skipUser);

// router.get("/matches", auth, async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user.id);

//     const matches = await User.find({
//       _id: { $in: currentUser.likedUsers },
//       likedUsers: req.user.id
//     }).select("-password -otp -otpExpiry -__v");

//     res.json(matches);

//   } catch (err) {
//     console.error("MATCHES ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const { getAllUsers, likeUser, skipUser } = require("../controllers/userController");
const Request = require("../models/Request");

// ================= GET ALL USERS =================
router.get("/all", getAllUsers);

// ================= PROFILE =================

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

// ================= DISCOVER (MAIN LOGIC) =================
router.get("/discover", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId);

    const users = await User.find(
      { _id: { $ne: userId } },
      "-password -otp -otpExpiry -__v"
    );

    const requests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // ✅ normalize skills
    const normalize = (arr) =>
      (arr || []).map((s) => s?.toLowerCase().trim());

    const currentOffered = normalize(currentUser.skillsOffered);
    const currentWanted = normalize(currentUser.skillsWanted);

    const processedUsers = users.map((user) => {
      const otherOffered = normalize(user.skillsOffered);
      const otherWanted = normalize(user.skillsWanted);

      // ✅ matching logic
      const offeredMatchCount = otherOffered.filter((skill) =>
        currentWanted.includes(skill)
      ).length;

      const wantedMatchCount = otherWanted.filter((skill) =>
        currentOffered.includes(skill)
      ).length;

      const swapScore =
        offeredMatchCount * 2 + wantedMatchCount * 2;

      const maxScore =
        currentWanted.length + currentOffered.length;

      const matchPercentage =
        maxScore === 0
          ? 0
          : Math.round(
              ((offeredMatchCount + wantedMatchCount) / maxScore) * 100
            );

      const isPerfectMatch =
        offeredMatchCount > 0 && wantedMatchCount > 0;

      // ✅ find request between users
      const reqData = requests.find(
        (r) =>
          (r.sender.toString() === userId &&
            r.receiver.toString() === user._id.toString()) ||
          (r.receiver.toString() === userId &&
            r.sender.toString() === user._id.toString())
      );

      return {
        ...user.toObject(),
        swapScore,
        matchPercentage,
        isPerfectMatch,
        requestStatus: reqData ? reqData.status : null,
        isSender: reqData
          ? reqData.sender.toString() === userId
          : false,
      };
    });

    // ✅ sort by best matches
    processedUsers.sort((a, b) => b.swapScore - a.swapScore);

    // ✅ split data for frontend
    res.json({
      recommended: processedUsers.filter((u) => u.swapScore > 0),
      allUsers: processedUsers.filter((u) => u.swapScore === 0),
    });

  } catch (err) {
    console.error("DISCOVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= LIKE / SKIP =================

// ❤️ LIKE
router.post("/like/:id", auth, likeUser);

// ❌ SKIP
router.post("/skip/:id", auth, skipUser);

// ================= MATCHES =================
router.get("/matches", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const matches = await User.find({
      _id: { $in: currentUser.likedUsers },
      likedUsers: req.user.id,
    }).select("-password -otp -otpExpiry -__v");

    res.json(matches);
  } catch (err) {
    console.error("MATCHES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

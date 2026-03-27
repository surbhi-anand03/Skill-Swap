const User = require("../models/User");
const Request = require("../models/Request");

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let { name, skillsOffered, skillsWanted, bio } = req.body;

    // ✅ Safety (avoid crash if undefined)
    skillsOffered = skillsOffered || [];
    skillsWanted = skillsWanted || [];

    // ✅ Normalize skills
    const formattedSkillsOffered = skillsOffered.map(s => s.toLowerCase());
    const formattedSkillsWanted = skillsWanted.map(s => s.toLowerCase());

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        skillsOffered: formattedSkillsOffered,
        skillsWanted: formattedSkillsWanted,
        bio
      },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= LIKE USER =================
exports.likeUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    // ❌ Prevent liking yourself
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot like yourself" });
    }

    // 1️⃣ Save like
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { likedUsers: targetUserId }
    });

    // 2️⃣ Check if reverse request exists (MATCH)
    const existingRequest = await Request.findOne({
      sender: targetUserId,
      receiver: currentUserId
    });

    if (existingRequest) {
      existingRequest.status = "accepted";
      await existingRequest.save();

      return res.json({ message: "It's a match!" });
    }

    // 3️⃣ Avoid duplicate request
    const alreadySent = await Request.findOne({
      sender: currentUserId,
      receiver: targetUserId
    });

    if (alreadySent) {
      return res.json({ message: "Request already sent" });
    }

    // 4️⃣ Create request
    await Request.create({
      sender: currentUserId,
      receiver: targetUserId,
      status: "pending"
    });

    res.json({ message: "Request sent!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= SKIP USER =================
exports.skipUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { skippedUsers: targetUserId }
    });

    res.json({ message: "Skipped successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id email skillsOffered skillsWanted");

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
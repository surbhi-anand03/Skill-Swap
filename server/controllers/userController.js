const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, skillsOffered, skillsWanted, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, skillsOffered, skillsWanted, bio },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❤️ LIKE USER
exports.likeUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { likedUsers: targetUserId }
    });

    res.json({ message: "Liked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ❌ SKIP USER
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

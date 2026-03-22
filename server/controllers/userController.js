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
const Match = require("../models/Match");

// Get all matches of logged-in user
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.find({
      users: userId,
    }).populate("users", "_id email");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
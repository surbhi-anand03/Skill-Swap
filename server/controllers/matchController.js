// const Match = require("../models/Match");

// // Get all matches of logged-in user
// exports.getMatches = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const matches = await Match.find({
//       users: userId,
//     }).populate("users", "_id email");

//     res.json(matches);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Match = require("../models/Match");

exports.getMatches = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const matches =
      await Match.find({
        users: userId,
      }).populate({
        path: "users",
        select:
          "_id name email bio profileImage skills skillsOffered skillsWanted",
      });

    // return only the other user
    const formattedMatches =
      matches.map((match) =>
        match.users.find(
          (u) =>
            u._id.toString() !==
            userId
        )
      );

    console.log(
      "MATCH USERS:",
      formattedMatches
    );

    res.json(
      formattedMatches
    );
  } catch (err) {
    console.log(
      "MATCH ERROR:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
};
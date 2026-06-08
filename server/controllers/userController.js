const User = require("../models/User");
const Request = require("../models/Request");

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      name,
      skillsOffered,
      skillsWanted,
      bio,
    } = req.body;

    skillsOffered = skillsOffered || [];
    skillsWanted = skillsWanted || [];

    const formattedSkillsOffered =
      skillsOffered.map((s) =>
        s.toLowerCase()
      );

    const formattedSkillsWanted =
      skillsWanted.map((s) =>
        s.toLowerCase()
      );

    const user =
      await User.findByIdAndUpdate(
        userId,
        {
          name,
          skillsOffered:
            formattedSkillsOffered,
          skillsWanted:
            formattedSkillsWanted,
          bio,
        },
        { new: true }
      );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers =
  async (req, res) => {
    try {
      const currentUserId =
        req.user?.id;

      const users =
        await User.find({
          _id: {
            $ne: currentUserId,
          },
        }).select("-password");

      res.json(users);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };

// ================= SKIP USER =================
exports.skipUser =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id;

      const targetUserId =
        req.params.id;

      let existing =
        await Request.findOne({
          sender:
            currentUserId,
          receiver:
            targetUserId,
        });

      if (existing) {
        existing.status =
          "skipped";

        await existing.save();

        return res.json({
          message:
            "User skipped",
        });
      }

      await Request.create({
        sender:
          currentUserId,
        receiver:
          targetUserId,
        status: "skipped",
      });

      res.json({
        message:
          "User skipped",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };

// ================= LIKE USER =================
exports.likeUser =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id;

      const targetUserId =
        req.params.id;

      const existing =
        await Request.findOne({
          sender:
            targetUserId,
          receiver:
            currentUserId,
          status: "pending",
        });

      if (existing) {
        existing.status =
          "accepted";

        await existing.save();

        return res.json({
          message:
            "Match created",
        });
      }

      res.json({
        message: "Liked",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };

// ================= UPLOAD PROFILE IMAGE =================
// exports.uploadProfileImage =
//   async (req, res) => {
//     try {
//       const user =
//         await User.findById(
//           req.user.id
//         );

//       if (!user) {
//         return res
//           .status(404)
//           .json({
//             message:
//               "User not found",
//           });
//       }

//       if (!req.file) {
//         return res
//           .status(400)
//           .json({
//             message:
//               "No image uploaded",
//           });
//       }

//       // Cloudinary URL
//       user.profileImage =
//         req.file.path;

//       await user.save();

//       res.status(200).json({
//         success: true,
//         image:
//           user.profileImage,
//       });
//     } catch (error) {
//       console.log(error);

//       res.status(500).json({
//         message:
//           "Upload failed",
//       });
//     }
//   };

exports.uploadProfileImage =
  async (req, res) => {
    try {

      console.log(req.file);

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({
            message:
              "No image uploaded",
          });
      }

      user.profileImage =
        req.file.path;

      await user.save();

      res.status(200).json({
        success: true,
        image:
          user.profileImage,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Upload failed",
      });
    }
  };
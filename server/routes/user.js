const express =
  require("express");

const router =
  express.Router();

const mongoose =
  require("mongoose");

const auth =
  require("../middleware/authMiddleware");

const User =
  require("../models/User");

const Request =
  require("../models/Request");

const upload =
  require("../middleware/upload");

const {
  getAllUsers,
  likeUser,
  skipUser,
  updateProfile,
  uploadProfileImage,
} = require(
  "../controllers/userController"
);

// GET all users
router.get(
  "/all",
  auth,
  getAllUsers
);

// GET profile
router.get(
  "/profile",
  auth,
  async (req, res) => {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    res.json(user);
  }
);

// UPDATE PROFILE
router.put(
  "/profile",
  auth,
  updateProfile
);

// UPLOAD PROFILE IMAGE
router.put(
  "/upload-image",
  auth,
  upload.single("image"),
  uploadProfileImage
);

// DISCOVER USERS
router.get(
  "/discover",
  auth,
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      const currentUser =
        await User.findById(
          userId
        );

      const requests = await Request.find({
        status: {
          $in: ["pending", "accepted"],
        },
        $or: [
          { sender: userId },
          { receiver: userId },
        ],
      });

      const relatedUserIds =
        new Set();

      requests.forEach((r) => {
        relatedUserIds.add(
          r.sender.toString()
        );

        relatedUserIds.add(
          r.receiver.toString()
        );
      });

      relatedUserIds.delete(
        userId
      );

      const relatedIds =
        Array.from(
          relatedUserIds
        ).map(
          (id) =>
            new mongoose.Types.ObjectId(
              id
            )
        );

      const users =
        await User.find({
          _id: {
            $nin: relatedIds,
          },
        });

      const normalize =
        (arr) =>
          (arr || []).map(
            (s) =>
              s
                .toLowerCase()
                .trim()
          );

      const currentOffered =
        normalize(
          currentUser.skillsOffered
        );

      const currentWanted =
        normalize(
          currentUser.skillsWanted
        );

      const processedUsers =
        users.map((user) => {
          const otherOffered =
            normalize(
              user.skillsOffered
            );

          const otherWanted =
            normalize(
              user.skillsWanted
            );

          const offeredMatchCount =
            otherOffered.filter(
              (skill) =>
                currentWanted.includes(
                  skill
                )
            ).length;

          const wantedMatchCount =
            otherWanted.filter(
              (skill) =>
                currentOffered.includes(
                  skill
                )
            ).length;

          const swapScore =
            offeredMatchCount *
              2 +
            wantedMatchCount *
              2;

          return {
            ...user.toObject(),
            swapScore,
            requestStatus:
              null,
            requestId:
              null,
            isSender:
              false,
          };
        });

      processedUsers.sort(
        (a, b) =>
          b.swapScore -
          a.swapScore
      );

      res.json({
        recommended:
          processedUsers.filter(
            (u) =>
              u.swapScore > 0
          ),

        allUsers:
          processedUsers.filter(
            (u) =>
              u.swapScore === 0
          ),
      });
    } catch (err) {
      res.status(500).json({
        error:
          err.message,
      });
    }
  }
);

// LIKE USER
router.post(
  "/like/:id",
  auth,
  likeUser
);

// SKIP USER
router.post(
  "/skip/:id",
  auth,
  skipUser
);

// MATCHES
router.get(
  "/matches",
  auth,
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      const requests =
        await Request.find({
          status:
            "accepted",

          $or: [
            {
              sender:
                userId,
            },
            {
              receiver:
                userId,
            },
          ],
        })
          .populate(
            "sender",
            "name email skillsOffered skillsWanted bio profileImage"
          )
          .populate(
            "receiver",
            "name email skillsOffered skillsWanted bio profileImage"
          );

      const uniqueMatches =
        [];

      const seen =
        new Set();

      requests.forEach(
        (r) => {
          const otherUser =
            r.sender._id.toString() ===
            userId
              ? r.receiver
              : r.sender;

          if (
            !seen.has(
              otherUser._id.toString()
            )
          ) {
            seen.add(
              otherUser._id.toString()
            );

            uniqueMatches.push(
              otherUser
            );
          }
        }
      );

      res.json(
        uniqueMatches
      );
    } catch (err) {
      console.error(
        "MATCH ERROR:",
        err
      );

      res.status(500).json({
        error:
          err.message,
      });
    }
  }
);

module.exports = router;
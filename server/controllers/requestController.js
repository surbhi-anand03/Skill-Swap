const Request = require("../models/Request");
const User = require("../models/User");
const Match = require("../models/Match");

// ================= SEND REQUEST =================

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        msg: "Cannot send request to yourself",
      });
    }

    // CHECK BOTH DIRECTIONS
    const existing = await Request.findOne({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({
          msg: "Request already exists",
        });
      }

      if (existing.status === "accepted") {
        return res.status(400).json({
          msg: "Already matched",
        });
      }

      // ignored / skipped → allow resend
    }

    const request = await Request.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.json({
      msg: "Request sent successfully",
      request,
    });
  } catch (err) {
    console.error("SEND REQUEST ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET INCOMING =================

exports.getIncoming = async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      `
      name
      skills
      skillsOffered
      skillsWanted
      bio
      profileImage
      `
    );

    res.json(requests);
  } catch (err) {
    console.error("GET INCOMING ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET PENDING (SENT) =================

exports.getPending = async (req, res) => {
  try {
    const requests = await Request.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "receiver",
      `
      name
      skills
      skillsOffered
      skillsWanted
      bio
      profileImage
      `
    );

    res.json(requests);
  } catch (err) {
    console.error("GET PENDING ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET SKIPPED =================

exports.getSkipped = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({
      status: "skipped",
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate(
        "sender",
        `
        name
        skills
        skillsOffered
        skillsWanted
        profileImage
        `
      )
      .populate(
        "receiver",
        `
        name
        skills
        skillsOffered
        skillsWanted
        profileImage
        `
      );

    res.json(requests);
  } catch (err) {
    console.error("GET SKIPPED ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= RESPOND REQUEST =================

exports.respondRequest = async (
  req,
  res
) => {
  try {
    const { requestId, action } =
      req.body;

    const userId = req.user.id;

    const request =
      await Request.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        msg: "Request not found",
      });
    }

    // CHECK AUTHORIZATION
    const isInvolved =
      request.receiver.toString() ===
        userId ||
      request.sender.toString() ===
        userId;

    if (!isInvolved) {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    // ================= ACCEPT =================
    if (action === "accepted") {
      request.status = "accepted";

      await request.save();

      // CHECK EXISTING MATCH
      const existingMatch =
        await Match.findOne({
          users: {
            $all: [
              request.sender,
              request.receiver,
            ],
          },
        });

      // CREATE MATCH
      if (!existingMatch) {
        await Match.create({
          users: [
            request.sender,
            request.receiver,
          ],
        });
      }

      // REMOVE DUPLICATE REQUESTS
      await Request.deleteMany({
        $or: [
          {
            sender: request.sender,
            receiver:
              request.receiver,
          },
          {
            sender:
              request.receiver,
            receiver:
              request.sender,
          },
        ],

        _id: {
          $ne: request._id,
        },
      });
    }

    // ================= IGNORE =================
    else if (action === "ignored") {
      request.status = "ignored";

      await request.save();
    }

    // ================= SKIP/CANCEL =================
    else if (action === "skipped") {
      request.status = "skipped";

      await request.save();
    }

    // ================= INVALID =================
    else {
      return res.status(400).json({
        msg: "Invalid action",
      });
    }

    res.json({
      msg: `Request ${action}`,
      request,
    });
  } catch (err) {
    console.error(
      "RESPOND REQUEST ERROR:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET ALL USERS =================

exports.getAllUsers = async (
  req,
  res
) => {
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
    console.error(
      "GET USERS ERROR:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
};
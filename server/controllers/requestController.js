const Request = require("../models/Request");
const User = require("../models/User");
const Match = require("../models/Match");
const Notification = require("../models/Notification");
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
      // Pending request exists
      if (existing.status === "pending") {
        return res.status(400).json({
          msg: "Request already pending",
        });
      }

      // Already matched
      if (existing.status === "accepted") {
        return res.status(400).json({
          msg: "Already matched",
        });
      }

      // Old ignored request → remove it and allow new request
      await Request.findByIdAndDelete(existing._id);
    }

    const request = await Request.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    await Notification.create({
      user:receiverId,
      sender:senderId,
      type:"request",
      message:"sent you a swap request"
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

// ================= RESPOND REQUEST =================

exports.respondRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const userId = req.user.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        msg: "Request not found",
      });
    }

    const isInvolved =
      request.receiver.toString() === userId ||
      request.sender.toString() === userId;

    if (!isInvolved) {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    // ACCEPT REQUEST
    if (action === "accepted") {
      request.status = "accepted";
      await request.save();

      await Notification.create({
        user:request.sender,
        sender:request.receiver,
        type:"accepted",
        message:"accepted your swap request"
      });

      const existingMatch = await Match.findOne({
        users: {
          $all: [
            request.sender,
            request.receiver,
          ],
        },
      });

      if (!existingMatch) {
        await Match.create({
          users: [
            request.sender,
            request.receiver,
          ],
        });
      }
    }

    // DECLINE OR SKIP
    else if (action === "ignored") {
      request.status = "ignored";
      await request.save();
    }

    else {
      return res.status(400).json({
        msg: "Invalid action",
      });
    }

    res.json({
      msg: `Request ${action} successfully`,
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


const Request = require("../models/Request");
const User = require("../models/User");


// ================= SEND REQUEST =================

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ msg: "Cannot send to yourself" });
    }

    // 🔍 check BOTH directions
    const existing = await Request.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({ msg: "Request already sent" });
      }

      if (existing.status === "accepted") {
        return res.status(400).json({ msg: "Already matched" });
      }

      // ignored/skipped → allow new request
    }

    // ✅ ALWAYS create NEW request
    const request = await Request.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.json({ msg: "Request sent", request });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET INCOMING =================
exports.getIncoming = async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "name");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ error: err.message });
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
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET PENDING =================
exports.getPending = async (req, res) => {
  try {
    const requests = await Request.find({
      sender: req.user.id,
      status: "pending",
    }).populate("receiver", "name");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.respondRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.user.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // ✅ Both sender and receiver must be involved
    const isInvolved =
      request.receiver.toString() === userId ||
      request.sender.toString() === userId;

    if (!isInvolved) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (action === "accepted") {
      request.status = "accepted";

      // ✅ Clean up duplicate requests between these two users
      await Request.deleteMany({
        $or: [
          { sender: request.sender, receiver: request.receiver },
          { sender: request.receiver, receiver: request.sender },
        ],
        _id: { $ne: request._id },
      });

    } else if (action === "ignored") {
      request.status = "ignored";
    } else if (action === "skipped") {
      request.status = "skipped";
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

    await request.save();
    res.json({ msg: `Request ${action}`, request });

  } catch (err) {
    console.error("RESPOND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
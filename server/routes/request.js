const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Request = require("../models/Request");
const User = require("../models/User");

// ================= SEND REQUEST =================
router.post("/send", auth, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    // ❌ prevent self request
    if (senderId === receiverId) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    // 🔍 check existing request
    let existing = await Request.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    // 🔁 RESEND LOGIC
    if (existing) {
      existing.status = "pending";
      existing.updatedAt = Date.now();
      await existing.save();
      return res.json(existing);
    }

    // ✅ create new request
    const request = await Request.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.json(request);

  } catch (err) {
    console.error("SEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= RESPOND =================
router.post("/respond", auth, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.user.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ✅ Only sender or receiver can act
    if (
      request.sender.toString() !== userId &&
      request.receiver.toString() !== userId
    ) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // ================= HANDLE ACTION =================
    if (action === "accepted") {
      request.status = "accepted";

      // 🔥 create match (store in likedUsers)
      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { likedUsers: request.receiver },
      });

      await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { likedUsers: request.sender },
      });

    } else if (action === "skipped") {
      request.status = "skipped";

    } else if (action === "ignored") {
      request.status = "ignored";

    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await request.save();

    res.json({
      msg: `Request ${action}`,
      request,
    });

  } catch (err) {
    console.error("RESPOND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ALL REQUESTS =================
router.get("/all", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name skillsOffered skillsWanted")
      .populate("receiver", "name skillsOffered skillsWanted");

    // ✅ SENT (pending)
    const pendingSent = requests.filter(
      (r) =>
        r.sender._id.toString() === userId &&
        r.status === "pending"
    );

    // ✅ INCOMING
    const incoming = requests.filter(
      (r) =>
        r.receiver._id.toString() === userId &&
        r.status === "pending"
    );

    // ✅ SKIPPED (only for this user)
    const skipped = requests.filter(
      (r) =>
        r.status === "skipped" &&
        (r.sender._id.toString() === userId ||
         r.receiver._id.toString() === userId)
    );

    // ✅ ACCEPTED (ONLY this user's matches)
    const accepted = requests.filter(
      (r) =>
        r.status === "accepted" &&
        (r.sender._id.toString() === userId ||
         r.receiver._id.toString() === userId)
    );

    res.json({
      pendingSent,
      incoming,
      skipped,
      accepted,
    });

  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
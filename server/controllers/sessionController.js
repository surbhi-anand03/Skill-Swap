const Session = require("../models/Session");

/* ================= CREATE SESSION ================= */
exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId, type, scheduledDate, startTime } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }

    if (userId === partnerId) {
      return res.status(400).json({
        message: "Cannot create session with yourself",
      });
    }

    // prevent duplicate session
    const existing = await Session.findOne({
      users: { $all: [userId, partnerId] },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) return res.json(existing);

    const session = await Session.create({
      users: [userId, partnerId],
      createdBy: userId,
      type: type || "scheduled",
      scheduledDate,
      startTime,
      status: "pending",
    });

    res.json(session);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= ACCEPT SESSION ================= */
exports.acceptSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (session.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "Creator cannot accept session",
      });
    }

    if (session.status === "rejected") {
      return res.status(400).json({
        message: "Session already rejected",
      });
    }

    session.status = "confirmed";
    session.meetingLink = "https://meet.google.com/test-link";

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= REJECT SESSION ================= */
exports.rejectSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    session.status = "rejected";

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= GET MY SESSIONS ================= */
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({
      users: userId,
    })
      .populate("users", "name email")
      .sort({ createdAt: -1 });

    const pending = sessions.filter(s => s.status === "pending");
    const upcoming = sessions.filter(s => s.status === "confirmed");
    const completed = sessions.filter(s => s.status === "completed");

    res.json({ pending, upcoming, completed });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= JOIN SESSION ================= */
exports.joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({
        message: "You are not part of this session",
      });
    }

    if (session.status !== "confirmed") {
      return res.status(400).json({
        message: "Session not ready",
      });
    }

    res.json({ meetingLink: session.meetingLink });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= COMPLETE SESSION ================= */
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "completed";

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
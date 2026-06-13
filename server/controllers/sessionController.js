
const Session = require("../models/Session");

/* ================= CREATE SESSION ================= */

const generateRoomId = require( "../utils/generateRoomId");

const Notification =require("../models/Notification");

exports.createSession = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const hostUser = req.user.id;

    const {
      participantUser,
      sessionType,
      skill,
      startTime
    } = req.body;

    if (!participantUser) {
      return res.status(400).json({
        message: "participantUser missing"
      });
    }

    const roomId = generateRoomId();

    const session = await Session.create({
      hostUser,
      participantUser,
      skill,
      sessionType,
      startTime,
      meetingProvider: "agora",
      meetingRoomId: roomId,
      status: "pending"
    });

    await Notification.create({
      user:participantUser,
      sender:hostUser,
      type:"session",
      message:"sent a session request"
    });

    res.json(session);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

/* ================= ACCEPT SESSION ================= */

exports.acceptSession = async (req, res) => {
  try {
    const session =
      await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (
      session.participantUser.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Only participant can accept",
      });
    }

    session.status =
      session.sessionType === "instant"
        ? "ongoing"
        : "upcoming";

    await session.save();

    await Notification.create({
      user:session.hostUser,
      sender:session.participantUser,
      type:"sessionAccepted",
      message:"accepted your session"
    });

    res.json(session);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= REJECT SESSION ================= */

exports.rejectSession = async (req, res) => {
  try {
    const session =
      await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (
      session.participantUser.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Only participant can reject",
      });
    }

    await Notification.create({
      user: session.hostUser,
      sender: session.participantUser,
      type: "sessionRejected",
      message: "rejected your session"
    });

    await Session.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Session rejected"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= GET MY SESSIONS ================= */

exports.getMySessions = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const sessions =
      await Session.find({
        $or: [
          { hostUser: userId },
          { participantUser: userId }
        ]
      })
      .populate(
  "hostUser participantUser",
  `
  name
  email
  bio
  profileImage
  skillsOffered
  skillsWanted
  `
)
      .sort({ createdAt: -1 });

    const pending =
      sessions.filter(
        s => s.status === "pending"
      );

    const upcoming =
      sessions.filter(
        s =>
          s.status === "upcoming" ||
          s.status === "ongoing"
      );

    const completed =
      sessions.filter(
        s => s.status === "completed"
      );

    res.json({
      pending,
      upcoming,
      completed
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ================= JOIN SESSION ================= */

const generateAgoraToken = require(
  "../services/agoraService"
);

exports.joinSession = async (
  req,
  res
) => {
  try {
    const session =
      await Session.findById(
        req.params.id
      );

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    const userId = req.user.id;

    const allowed =
      session.hostUser.toString() === userId ||
      session.participantUser.toString() === userId;

    if (!allowed) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    // scheduled check
    if (
      session.sessionType === "scheduled"
    ) {
      const now = new Date();

      const tenMinutesBefore =
        new Date(session.startTime);

      tenMinutesBefore.setMinutes(
        tenMinutesBefore.getMinutes() - 10
      );

      if (now < tenMinutesBefore) {
        return res.status(400).json({
          message:
            "Join enabled 10 mins before session"
        });
      }
    }

    if (!session.joinedAt) {
      session.joinedAt =
        new Date();
      session.status =
        "ongoing";
      await session.save();
    }

    const token =
      generateAgoraToken(
        session.meetingRoomId
      );

    res.json({
      appId:
        process.env.AGORA_APP_ID,
      token,
      channelName:
        session.meetingRoomId
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ================= COMPLETE SESSION ================= */

exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(
      req.params.id
    );

    if (!session) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    session.endedAt = new Date();
    session.status = "completed";

    // safety check
    if (!session.joinedAt) {
      session.duration = "0 mins";
    } else {
      const diff =
        session.endedAt - session.joinedAt;

      const totalMinutes =
        Math.floor(diff / 60000);

      const hours =
        Math.floor(totalMinutes / 60);

      const minutes =
        totalMinutes % 60;

      // format duration
      if (hours > 0 && minutes > 0) {
        session.duration =
          `${hours} hr ${minutes} mins`;
      }

      else if (hours > 0) {
        session.duration =
          `${hours} hr`;
      }

      else {
        session.duration =
          `${minutes} mins`;
      }
    }

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
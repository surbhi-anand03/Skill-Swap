// const Session = require("../models/Session");

// /* ================= CREATE SESSION ================= */
// // exports.createSession = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { partnerId, type, scheduledDate, startTime } = req.body;

// //     if (!partnerId) {
// //       return res.status(400).json({ message: "partnerId is required" });
// //     }

// //     if (userId === partnerId) {
// //       return res.status(400).json({
// //         message: "Cannot create session with yourself",
// //       });
// //     }

// //     // prevent duplicate session
// //     const existing = await Session.findOne({
// //       users: { $all: [userId, partnerId] },
// //       status: { $in: ["pending", "confirmed"] },
// //     });

// //     if (existing) return res.json(existing);

// //     const session = await Session.create({
// //       users: [userId, partnerId],
// //       createdBy: userId,
// //       type: type || "scheduled",
// //       scheduledDate,
// //       startTime,
// //       status: "pending",
// //     });

// //     res.json(session);

// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// exports.createSession = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { partnerId, type, scheduledDate, startTime } = req.body;

//     if (!partnerId) {
//       return res.status(400).json({ message: "partnerId is required" });
//     }

//     if (userId === partnerId) {
//       return res.status(400).json({
//         message: "Cannot create session with yourself",
//       });
//     }

//     const existing = await Session.findOne({
//       users: { $all: [userId, partnerId] },
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (existing) return res.json(existing);

//     let session;

//     // ⚡ INSTANT SESSION
//     if (type === "instant") {
//       const roomName = `skillswap-${userId}-${partnerId}`;

//       session = await Session.create({
//         users: [userId, partnerId],
//         createdBy: userId,
//         type: "instant",
//         status: "confirmed",
//         meetingLink: `https://meet.jit.si/${roomName}`,
//       });
//     }

//     // 📅 SCHEDULED SESSION
//     else {
//       session = await Session.create({
//         users: [userId, partnerId],
//         createdBy: userId,
//         type: "scheduled",
//         scheduledDate,
//         startTime,
//         status: "pending",
//       });
//     }

//     res.json(session);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= ACCEPT SESSION ================= */
// exports.acceptSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);
//     const userId = req.user.id;

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (!session.users.includes(userId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     if (session.createdBy.toString() === userId) {
//       return res.status(400).json({
//         message: "Creator cannot accept session",
//       });
//     }

//     if (session.status === "rejected") {
//       return res.status(400).json({
//         message: "Session already rejected",
//       });
//     }

//     session.status = "confirmed";
//     // session.meetingLink = "https://meet.google.com/test-link";

//     const roomName = `skillswap-${userId}-${session._id}`;
//     session.meetingLink = `https://meet.jit.si/${roomName}`;

//     await session.save();

//     res.json(session);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// /* ================= REJECT SESSION ================= */
// exports.rejectSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);
//     const userId = req.user.id;

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (!session.users.includes(userId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     session.status = "rejected";

//     await session.save();

//     res.json(session);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// /* ================= GET MY SESSIONS ================= */
// exports.getMySessions = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const sessions = await Session.find({
//       users: userId,
//     })
//       .populate("users", "name email")
//       .sort({ createdAt: -1 });

//     const pending = sessions.filter(s => s.status === "pending");
//     const upcoming = sessions.filter(s => s.status === "confirmed");
//     const completed = sessions.filter(s => s.status === "completed");

//     res.json({ pending, upcoming, completed });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// /* ================= JOIN SESSION ================= */
// // exports.joinSession = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.id);
// //     const userId = req.user.id;

// //     if (!session) {
// //       return res.status(404).json({ message: "Session not found" });
// //     }

// //     if (!session.users.includes(userId)) {
// //       return res.status(403).json({
// //         message: "You are not part of this session",
// //       });
// //     }

// //     if (session.status !== "confirmed") {
// //       return res.status(400).json({
// //         message: "Session not ready",
// //       });
// //     }

// //     res.json({ meetingLink: session.meetingLink });

// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// exports.joinSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);
//     const userId = req.user.id;

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (!session.users.includes(userId)) {
//       return res.status(403).json({
//         message: "You are not part of this session",
//       });
//     }

//     if (session.status !== "confirmed") {
//       return res.status(400).json({
//         message: "Session not ready",
//       });
//     }

//     // 📅 CHECK TIME FOR SCHEDULED
//     if (session.type === "scheduled" && session.scheduledDate) {
//       const now = new Date();
//       const sessionTime = new Date(session.scheduledDate);

//       if (now < sessionTime) {
//         return res.status(400).json({
//           message: "Session not started yet",
//         });
//       }
//     }

//     res.json({ meetingLink: session.meetingLink });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// /* ================= COMPLETE SESSION ================= */
// exports.completeSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     session.status = "completed";

//     await session.save();

//     res.json(session);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Session = require("../models/Session");

/* ================= CREATE SESSION ================= */
exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      partnerId,
      type,
      scheduledDate,
      startTime,
    } = req.body;

    if (!partnerId) {
      return res.status(400).json({
        message: "partnerId is required",
      });
    }

    if (userId === partnerId) {
      return res.status(400).json({
        message: "Cannot create session with yourself",
      });
    }

    const existing = await Session.findOne({
      users: { $all: [userId, partnerId] },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) {
      return res.json(existing);
    }

    const roomName = `skillswap-${userId}-${partnerId}`;

    let session;

    // ⚡ INSTANT SESSION
    if (type === "instant") {
      session = await Session.create({
        users: [userId, partnerId],
        createdBy: userId,
        type: "instant",

        // IMPORTANT
        status: "pending",

        meetingLink: `https://meet.jit.si/${roomName}`,
      });
    }

    // 📅 SCHEDULED SESSION
    else {
      session = await Session.create({
        users: [userId, partnerId],
        createdBy: userId,
        type: "scheduled",
        scheduledDate,
        startTime,

        // IMPORTANT
        status: "pending",

        meetingLink: `https://meet.jit.si/${roomName}`,
      });
    }

    res.json(session);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


/* ================= ACCEPT SESSION ================= */
exports.acceptSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // only receiver can accept
    if (session.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "Creator cannot accept own request",
      });
    }

    session.status = "confirmed";

    await session.save();

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
    const session = await Session.findById(req.params.id);

    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // only receiver can reject
    if (session.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "Creator cannot reject own request",
      });
    }

    session.status = "rejected";

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
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

    const pending = sessions.filter(
      (s) => s.status === "pending"
    );

    const upcoming = sessions.filter(
      (s) => s.status === "confirmed"
    );

    const completed = sessions.filter(
      (s) => s.status === "completed"
    );

    res.json({
      pending,
      upcoming,
      completed,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


/* ================= JOIN SESSION ================= */
// exports.joinSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.id);

//     const userId = req.user.id;

//     if (!session) {
//       return res.status(404).json({
//         message: "Session not found",
//       });
//     }

//     if (!session.users.includes(userId)) {
//       return res.status(403).json({
//         message: "Not allowed",
//       });
//     }

//     if (session.status !== "confirmed") {
//       return res.status(400).json({
//         message: "Session not confirmed yet",
//       });
//     }

//     // 📅 SCHEDULED TIME CHECK
//     if (
//       session.type === "scheduled" &&
//       session.scheduledDate
//     ) {
//       const now = new Date();

//       const scheduled = new Date(session.scheduledDate);

//       if (now < scheduled) {
//         return res.status(400).json({
//           message:
//             "Please join on scheduled date & time",
//         });
//       }
//     }

//     // save join time
//     if (!session.joinedAt) {
//       session.joinedAt = new Date();
//       await session.save();
//     }

//     res.json({
//       meetingLink: session.meetingLink,
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

/* ================= JOIN SESSION ================= */
exports.joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const userId = req.user.id;

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (!session.users.includes(userId)) {
      return res.status(403).json({
        message: "You are not part of this session",
      });
    }

    if (session.status !== "confirmed") {
      return res.status(400).json({
        message: "Session not confirmed yet",
      });
    }

    /* =========================================
       SCHEDULED SESSION TIME CHECK
    ========================================= */

    if (
      session.type === "scheduled" &&
      session.scheduledDate &&
      session.startTime
    ) {

      // Example:
      // scheduledDate = 2026-05-07
      // startTime = 08:39 PM

      const date = new Date(session.scheduledDate);

      const [time, modifier] = session.startTime.split(" ");

      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      minutes = parseInt(minutes);

      // AM PM conversion
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      // Set exact meeting time
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);

      const now = new Date();

      // ❌ BEFORE TIME
      if (now < date) {
        return res.status(400).json({
          message: `Session will start at ${session.startTime}`,
        });
      }
    }

    // ✅ ALLOW JOIN
    res.json({
      meetingLink: session.meetingLink,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= COMPLETE SESSION ================= */
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.status = "completed";

    session.endedAt = new Date();

    // calculate duration
    if (session.joinedAt && session.endedAt) {
      const diff =
        session.endedAt - session.joinedAt;

      const mins = Math.floor(diff / 60000);

      session.duration = `${mins} mins`;
    }

    await session.save();

    res.json(session);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
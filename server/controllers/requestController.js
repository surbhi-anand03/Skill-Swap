// const Request = require("../models/Request");
// const Match = require("../models/Match");


// // Send Request
// exports.sendRequest = async (req, res) => {
//   try {
//     console.log("🔥 SEND REQUEST HIT"); // 1

//     console.log("FROM USER:", req.user.id); // 2

//     console.log("TO USER:", req.params.id); // 3

//     const { receiverId } = req.body;

//     const request = await Request.create({
//       sender: req.user.id,
//       receiver: receiverId,
//     });

//     res.json(request);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Incoming Requests
// exports.getIncoming = async (req, res) => {
//   try {
//     const requests = await Request.find({
//       receiver: req.user.id,
//       status: "pending",
//     }).populate("sender");

//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Pending Requests
// exports.getPending = async (req, res) => {
//   try {
//     const requests = await Request.find({
//       sender: req.user.id,
//       status: "pending",
//     }).populate("receiver");

//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Accept
// exports.acceptRequest = async (req, res) => {
//   try {
//     const request = await Request.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     // Update status
//     request.status = "accepted";
//     await request.save();

//     // 🔥 Create match
//     const existingMatch = await Match.findOne({
//       users: { $all: [request.sender, request.receiver] },
//     });

//     if (!existingMatch) {
//       await Match.create({
//         users: [request.sender, request.receiver],
//       });
//     }

//     res.json({ msg: "Request accepted & match created" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Reject
// exports.rejectRequest = async (req, res) => {
//   try {
//     const request = await Request.findByIdAndUpdate(
//       req.params.id,
//       { status: "rejected" },
//       { new: true }
//     );

//     res.json(request);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Request = require("../models/Request");
const Match = require("../models/Match");
const User = require("../models/User"); // ✅ ADD THIS

// ================= SEND REQUEST =================
exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    // 🔥 prevent duplicate request
    const existing = await Request.findOne({
      sender: req.user.id,
      receiver: receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ msg: "Request already sent" });
    }

    const request = await Request.create({
      sender: req.user.id,
      receiver: receiverId,
    });

    res.json(request);

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


// ================= 🔥 MAIN CONTROL API =================
exports.respondRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.user.id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // ✅ allow both users
    if (
      request.sender.toString() !== userId &&
      request.receiver.toString() !== userId
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // 🔥 HANDLE ACTIONS
    if (action === "accept") {
      request.status = "accepted";

      // ✅ MATCH LOGIC (IMPORTANT)
      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { likedUsers: request.receiver },
      });

      await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { likedUsers: request.sender },
      });

      // (optional) also create Match doc
      const existingMatch = await Match.findOne({
        users: { $all: [request.sender, request.receiver] },
      });

      if (!existingMatch) {
        await Match.create({
          users: [request.sender, request.receiver],
        });
      }

    } else if (action === "skip") {
      request.status = "skipped";

    } else if (action === "ignore") {
      request.status = "ignored";
    }

    await request.save();

    res.json({ msg: `Request ${action}ed`, request });

  } catch (err) {
    console.error("RESPOND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

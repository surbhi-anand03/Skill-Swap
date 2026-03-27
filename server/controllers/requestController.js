const Request = require("../models/Request");
const Match = require("../models/Match");


// Send Request
exports.sendRequest = async (req, res) => {
  try {
    console.log("🔥 SEND REQUEST HIT"); // 1

    console.log("FROM USER:", req.user.id); // 2

    console.log("TO USER:", req.params.id); // 3

    const { receiverId } = req.body;

    const request = await Request.create({
      sender: req.user.id,
      receiver: receiverId,
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Incoming Requests
exports.getIncoming = async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pending Requests
exports.getPending = async (req, res) => {
  try {
    const requests = await Request.find({
      sender: req.user.id,
      status: "pending",
    }).populate("receiver");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Update status
    request.status = "accepted";
    await request.save();

    // 🔥 Create match
    const existingMatch = await Match.findOne({
      users: { $all: [request.sender, request.receiver] },
    });

    if (!existingMatch) {
      await Match.create({
        users: [request.sender, request.receiver],
      });
    }

    res.json({ msg: "Request accepted & match created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
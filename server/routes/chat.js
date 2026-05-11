const express = require("express");
const router = express.Router();

const Message = require("../models/Message");


// SEND MESSAGE
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET CHAT MESSAGES
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
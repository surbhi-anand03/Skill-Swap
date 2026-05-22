const express = require("express");

const router = express.Router();

const Message = require("../models/Message");


// ================= SEND MESSAGE =================
router.post("/send", async (req, res) => {

  try {

    const {
      sender,
      receiver,
      text,
    } = req.body;

    // VALIDATION
    if (!sender || !receiver || !text) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    res.json(message);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ================= GET CHAT =================
router.get("/:user1/:user2", async (req, res) => {

  try {

    const { user1, user2 } = req.params;

    console.log("Fetching chat:", user1, user2);

    // VALIDATION
    if (!user1 || !user2) {

      return res.status(400).json({
        error: "Missing user ids",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          receiver: user2,
        },
        {
          sender: user2,
          receiver: user1,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {

    console.log("CHAT ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


module.exports = router;
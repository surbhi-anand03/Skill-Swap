const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");


// SEND MESSAGE
router.post("/send", auth, async (req, res) => {
  try {
    // const { sender, receiver, text } = req.body;

    const sender = req.user.id;
    const { receiver, text } = req.body;

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    res.json(message);
  } catch (err) {
    console.log("CONVERSATION ERROR:");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// router.get("/:userId", auth, async (req, res) => {

//   try {

//     const currentUser = req.user.id;

//     const otherUser = req.params.userId;

//     const messages = await Message.find({
//       $or: [
//         {
//           sender: currentUser,
//           receiver: otherUser,
//         },
//         {
//           sender: otherUser,
//           receiver: currentUser,
//         },
//       ],
//     }).sort({ createdAt: 1 });

//     res.json(messages);

//   } catch (err) {

//     res.status(500).json({
//       error: err.message,
//     });

//   }
// });

// GET ALL CONVERSATIONS
router.get("/conversations/all", auth, async (req, res) => {
  try {
    const currentUser = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUser },
        { receiver: currentUser },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    const conversations = {};

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === currentUser
          ? msg.receiver
          : msg.sender;

      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = {
          user: otherUser,
          lastMessage: msg.text,
          updatedAt: msg.createdAt,
        };
      }
    });

    res.json(Object.values(conversations));

  } catch (err) {
    console.log("CONVERSATION ERROR:");
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
});


// GET CHAT MESSAGES

router.get("/:user1/:user2", auth, async (req, res) => {
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
    console.log("CONVERSATION ERROR:");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
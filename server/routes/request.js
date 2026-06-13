const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  sendRequest,
  getIncoming,
  getPending,
  respondRequest,
} = require("../controllers/requestController");


// Send connection request
router.post("/send", auth, sendRequest);

// Incoming requests
router.get("/incoming", auth, getIncoming);

// Sent pending requests
router.get("/pending", auth, getPending);

// Accept / Ignore request
router.post("/respond", auth, respondRequest);


module.exports = router;
const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getIncoming,
  getPending,
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");

const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/send", authMiddleware, sendRequest);
router.get("/incoming", authMiddleware, getIncoming);
router.get("/pending", authMiddleware, getPending);
router.post("/accept/:id", authMiddleware, acceptRequest);
router.post("/reject/:id", authMiddleware, rejectRequest);

module.exports = router;
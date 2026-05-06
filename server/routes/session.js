const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createSession,
  acceptSession,
  rejectSession,
  getMySessions,
  joinSession,
  completeSession,
} = require("../controllers/sessionController");

router.post("/create", auth, createSession);

router.patch("/:id/accept", auth, acceptSession);
router.patch("/:id/reject", auth, rejectSession);
router.patch("/:id/complete", auth, completeSession);

router.get("/my", auth, getMySessions);
router.get("/:id/join", auth, joinSession);

module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getSkipped } = require("../controllers/requestController");

const {
  sendRequest,
  getIncoming,
  getPending,
  respondRequest,
} = require("../controllers/requestController");

router.post("/send", auth, sendRequest);
router.get("/incoming", auth, getIncoming);
router.get("/pending", auth, getPending);
router.post("/respond", auth, respondRequest);
router.get("/skipped", auth, getSkipped);

module.exports = router;

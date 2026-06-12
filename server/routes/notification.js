// const express =
// require("express");

// const router =
// express.Router();

// const auth =
// require("../middleware/authMiddleware");

// const {
// getNotifications
// }
// =
// require(
// "../controllers/notificationController"
// );

// router.get(
// "/",
// auth,
// getNotifications
// );

// module.exports =
// router;

const express = require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead
} =
require("../controllers/notificationController");


// GET ALL NOTIFICATIONS

router.get(
  "/",
  auth,
  getNotifications
);


// MARK AS READ

router.patch(
  "/:id/read",
  auth,
  markAsRead
);

module.exports = router;
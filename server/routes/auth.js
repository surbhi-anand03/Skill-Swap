const express = require("express");
const router = express.Router();

const {
  requestOtp,
  verifyOtp,
  register,
  login,
  forgotPasswordOtp,
  resetPassword
} = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);      // ✅ new
router.post("/register", register);  

router.post("/login", login);

router.post("/forgot-password/request-otp", forgotPasswordOtp);
router.post("/forgot-password/verify-otp", resetPassword);

module.exports = router;

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail  = require("../utils/sendEmail");

/* =========================
   SIGNUP - SEND OTP
========================= */
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (user && user.password) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!user) {
      user = new User({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);

  //   await sendEmail(
  //   email,
  //   "SkillSwap OTP Verification",
  //   `Welcome to SkillSwap!

  //     Your OTP is: ${otp}
  //     It is valid for 5 minutes.

  //     Do not share this OTP with anyone.

  //     - SkillSwap Team`
  // );

  await sendEmail(
  email,
    "SkillSwap OTP Verification",
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      
      <h2 style="color: #4CAF50;">🎉 Welcome to SkillSwap</h2>
      
      <p>Hello,</p>
      
      <p>Thank you for choosing <b>SkillSwap</b>! Please use the One-Time Password (OTP) below to proceed:</p>
      
      <div style="margin: 20px 0; padding: 15px; background: #f4f4f4; border-radius: 8px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; color: #000;">
          ${otp}
        </span>
      </div>
      
      <p>❗ This OTP is valid for <b>5 minutes</b>.</p>
      
      <p>⚠️ For your security, do not share this OTP with anyone.</p>
      
      <hr style="margin: 20px 0;">
      
      <p style="font-size: 14px; color: #302e2e;">
        If you did not request this, please ignore this email.
      </p>
      
      <p>Best regards,<br><b>SkillSwap Team</b>🤝</p>
    
    </div>
    `
);
    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   VERIFY OTP + CREATE USER
========================= */
// exports.verifyOtpRegister = async (req, res) => {
//   try {
//     const { email, otp, name, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.name = name;
//     user.password = hashedPassword;

//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     res.json({ message: "Signup successful" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user._doc;

    res.json({ token, user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   FORGOT PASSWORD - SEND OTP
========================= */
exports.forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, 
      "SkillSwap Password Reset OTP", 
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        
        <h2 style="color: #e53935;">🛡️ SkillSwap Password Reset</h2>
        
        <p>Hello,</p>
        
        <p>
          We received a request to reset your <b>SkillSwap</b> account password.  
          Please use the One-Time Password (OTP) below to proceed:
        </p>
        
        <div style="margin: 20px 0; padding: 15px; background: #f4f4f4; border-radius: 8px; text-align: center;">
          <span style="font-size: 28px; font-weight: bold; color: #000;">
            ${otp}
          </span>
        </div>
        
        <p>🔺This OTP is valid for <b>5 minutes</b>.</p>
        
        <p>⚠️ For your security, do not share this OTP with anyone.</p>
        
        <hr style="margin: 20px 0;">
        
        <p style="font-size: 14px; color: #0a0a0a;">
          If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
        </p>
        
        <p>Best regards,<br><b>SkillSwap Team 🤝</b></p>

      </div>
      `
    );

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   VERIFY OTP + RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const cleanOtp = otp.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
  }
    user.password = await bcrypt.hash(newPassword, 10);

    console.log("Stored OTP:", user.otp);
    console.log("Entered OTP:", otp);
    console.log("Expiry:", user.otpExpiry);
    console.log("Now:", Date.now());

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanOtp = otp.trim();
    const user = await User.findOne({ email });

    // if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    //   return res.status(400).json({ message: "Invalid or expired OTP" });
    // }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
  }

  console.log("====== OTP DEBUG ======");
  console.log("Stored OTP:", user?.otp);
  console.log("Entered OTP:", otp);
  console.log("Expiry:", user?.otpExpiry);
  console.log("Current Time:", Date.now());
  console.log("=======================");

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password) {
      return res.status(400).json({ message: "User already registered" });
    }

    user.name = name;
    user.password = await bcrypt.hash(password, 10);

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Signup complete" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
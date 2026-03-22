import { useState } from "react";
import {
  forgotPasswordOtp,
  verifyOtp,
  resetPassword,
} from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordOtp({ email });

      alert("OTP sent successfully 📩"); // ✅ added

      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({
        email,
        otp: otp.trim(),
      });

      alert("OTP verified ✅");

      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({
        email,
        otp: otp.trim(),
        newPassword: password,
      });

      alert("Password reset successful 🎉");

      navigate("/"); // redirect
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
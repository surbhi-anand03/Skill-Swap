import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth";
import "./VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp });
      alert("OTP verified ✅");
      navigate("/complete-profile", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button>Verify</button>
        </form>
      </div>
    </div>
  );
}
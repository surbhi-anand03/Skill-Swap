import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp } from "../api/auth";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestOtp({ email });
      localStorage.setItem("email", email);
      alert("OTP sent 📩");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button>Send OTP</button>
        </form>
      </div>
    </div>
  );
}
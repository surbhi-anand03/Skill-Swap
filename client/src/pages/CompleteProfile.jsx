import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./CompleteProfile.css";

export default function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("email");

  const [form, setForm] = useState({ name: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ email, ...form });
      alert("Signup complete 🎉");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Complete Profile</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button>Finish Signup</button>
        </form>
      </div>
    </div>
  );
}
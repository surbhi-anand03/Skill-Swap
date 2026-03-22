import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);

      alert("Login successful 🚀");

      localStorage.setItem("token", res.data.token);
      navigate("/home");
      console.log("LOGIN TOKEN:", res.data.token);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-top">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="user"
            className="login-avatar"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <input
            type="email"
            name="email"
            placeholder="Username or Email"
            onChange={handleChange}
            className="login-input"
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="login-input"
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="forgot">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2>SkillSwap</h2>

      <div>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => navigate("/home")}>Home</button>
        <Link to="/discover">Discover</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
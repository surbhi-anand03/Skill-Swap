import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-container">
      <h1>Welcome to SkillSwap 🎉</h1>
      <p>Start exchanging skills 🚀</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
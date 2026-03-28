import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaHome,
  FaSearch,
  FaUsers,
  FaSignOutAlt,
  FaBell 
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItem = (path, icon, label) => (
    <Link
      to={path}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition 
      ${
        location.pathname === path
          ? "bg-indigo-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 z-50">

      {/* 🔥 Logo */}
      <h2
        className="text-xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        SkillSwap
      </h2>

      {/* 🔗 Nav Links */}
      <div className="flex items-center gap-3">

        {navItem("/home", <FaHome />, "Home")}
        {navItem("/discover", <FaSearch />, "Discover")}
        {navItem("/matches", <FaUsers />, "Matches")}
        {navItem("/profile", <FaUserCircle />, "Profile")}
        {navItem("/requests", <FaBell />, "Requests")}

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  FaUserCircle,
  FaHome,
  FaSearch,
  FaUsers,
  FaVideo,
  FaSignOutAlt,
  FaBell,
  FaComments,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const navItem = (path, icon, label) => (
    <Link
      to={path}
      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition
      ${
        location.pathname === path
          ? "bg-indigo-100 text-indigo-600 font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-50">

      {/* Logo */}
      <div className="p-6 border-b">
        <h2
          className="text-3xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          SkillSwap
        </h2>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 p-4 flex-1">

        {navItem("/home", <FaHome />, "Dashboard")}

        {navItem(
          "/discover",
          <FaSearch />,
          "Discover"
        )}

        {navItem(
          "/requests",
          <FaBell />,
          "Requests"
        )}

        {navItem(
          "/matches",
          <FaUsers />,
          "Matches"
        )}

        {navItem(
          "/sessions",
          <FaVideo />,
          "Sessions"
        )}


        {navItem(
          "/chats",
          <FaComments />,
          "Chats"
        )}

        {navItem(
          "/profile",
          <FaUserCircle />,
          "Profile"
        )}

      </div>

      {/* Logout */}
      <div className="p-4 border-t">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 px-4 py-3 rounded-lg hover:bg-red-50 w-full"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
}
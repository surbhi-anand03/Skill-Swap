import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";

import {
  FaUserCircle,
  FaHome,
  FaUsers,
  FaVideo,
  FaSignOutAlt,
  FaComments,
  FaCompass,
  FaExchangeAlt,
  FaBars,
  FaTimes,
  FaBell
} from "react-icons/fa";

import { getNotifications } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  const menuItems = [
    {
      path: "/home",
      icon: <FaHome size={20} />,
      label: "Home",
    },
    {
      path: "/discover",
      icon: <FaCompass size={20} />,
      label: "Explore",
    },
    {
      path: "/requests",
      icon: <FaUsers size={20} />,
      label: "Requests",
    },
    {
      path: "/matches",
      icon: (
        <FaExchangeAlt size={20} />
      ),
      label: "Swaps",
    },
    {
      path: "/sessions",
      icon: <FaVideo size={20} />,
      label: "Sessions",
    },
    {
      path: "/chats",
      icon: (
        <FaComments size={20} />
      ),
      label: "Chats",
    },
    {
      path: "/notifications",
      icon: <FaBell size={20} />,
      label: "Notifications",
    },
    {
      path: "/profile",
      icon: (
        <FaUserCircle size={20} />
      ),
      label: "Profile",
    },
  ];

  const navItem = (
    path,
    icon,
    label
  ) => (
    <Link
      key={path}
      to={path}
      onClick={() =>
        setOpen(false)
      }
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
      ${
        location.pathname === path
          ? "bg-violet-100 text-violet-600 font-semibold"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  const [notificationCount, setNotificationCount] =
    useState(0);

    useEffect(() => {

      loadNotifications();

      const interval = setInterval(() => {

        loadNotifications();

      }, 5000);

      return () => clearInterval(interval);

    }, []);

    const loadNotifications = async () => {

      try {

        const data =
          await getNotifications();

        setNotificationCount(
          data.length
        );

      }

      catch (err) {

        console.log(err);

      }

    };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">

        <h1
        onClick={() => navigate("/home")}
        className="text-2xl font-black text-violet-600 cursor-pointer"
      >
        SkillSwap
      </h1>

      <div className="flex items-center gap-3">

        {/* Notification Bell */}

        <Link
        to="/notifications"
        className="
        relative
        w-11
        h-11
        rounded-xl
        bg-violet-100
        text-violet-600
        flex
        items-center
        justify-center
        "
      >
        <FaBell size={18} />

        {
          notificationCount > 0 && (
            <span
              className="
              absolute
              -top-1
              -right-1
              min-w-[20px]
              h-5
              px-1
              rounded-full
              bg-green-600
              text-white
              text-[11px]
              font-bold
              flex
              items-center
              justify-center
              "
            >
              {
                notificationCount > 99
                  ? "99+"
                  : notificationCount
              }
            </span>
          )
        }

</Link>

  {/* Menu Button */}

  <button
    onClick={() => setOpen(!open)}
    className="
    w-11
    h-11
    rounded-xl
    bg-violet-100
    text-violet-600
    flex
    items-center
    justify-center
    "
  >
    {open ? (
      <FaTimes size={20} />
    ) : (
      <FaBars size={20} />
    )}
  </button>

</div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300
        ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() =>
            setOpen(false)
          }
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl p-5 transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">

            <h2 className="text-2xl font-bold text-violet-600">
              Menu
            </h2>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="text-slate-500"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map(
              (item) =>
                navItem(
                  item.path,
                  item.icon,
                  item.label
                )
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 text-red-500 px-4 py-3 rounded-2xl hover:bg-red-50 w-full"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}

      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 shadow-sm flex-col z-40">

        {/* Logo */}
        <div className="px-8 py-7 border-b border-slate-200">

          <h2
            onClick={() =>
              navigate("/home")
            }
            className="text-4xl font-black text-violet-600 cursor-pointer"
          >
            SkillSwap
          </h2>

          <p className="text-slate-500 mt-1 text-sm">
            Learn • Teach • Grow
          </p>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 p-5 flex-1 overflow-y-auto">

          {menuItems.map(
            (item) =>
              navItem(
                item.path,
                item.icon,
                item.label
              )
          )}
        </div>

        {/* Logout */}
        <div className="p-5 border-t border-slate-200">

          <button
            onClick={
              handleLogout
            }
            className="flex items-center gap-3 text-red-500 px-4 py-3 rounded-2xl hover:bg-red-50 w-full transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

    </>
  );
}
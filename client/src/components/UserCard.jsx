import { motion } from "framer-motion";
import { Heart, X, User, Users } from "lucide-react";
import { useState } from "react";

// ✅ IMPORT APIs
import { sendRequest, skipUser } from "../api/api";

const UserCard = ({ user, onLike, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "sent" | "skipped"

  const getColor = (percent) => {
    if (percent > 75) return "bg-green-500";
    if (percent > 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  // ❤️ SEND REQUEST
  const handleRequest = async () => {
    try {
      setLoading(true);

      await sendRequest(user._id); // ✅ correct API

      setStatus("sent");

      // optional parent refresh
      if (onLike) onLike(user._id);

    } catch (err) {
      console.error("REQUEST ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ SKIP USER
  const handleSkip = async () => {
    try {
      setLoading(true);

      await skipUser(user._id); // ✅ FIXED (no 403 now)

      setStatus("skipped");

      // optional parent refresh
      if (onSkip) onSkip(user._id);

    } catch (err) {
      console.error("SKIP ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-3xl shadow-lg w-80 overflow-hidden transition"
    >

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 flex flex-col items-center text-white">

        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow">
            <User size={36} className="text-gray-500" />
          </div>
        )}

        <h2 className="mt-3 text-lg font-semibold">
          {user.name || "No Name"}
        </h2>

        <p className="text-sm opacity-90 text-center">
          {user.bio || "No bio available"}
        </p>
      </div>

      {/* 🔹 CONTENT */}
      <div className="p-5">

        {/* OFFERS */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Offers
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.length > 0 ? (
              user.skillsOffered.map((s, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </div>
        </div>

        {/* WANTS */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Wants
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.length > 0 ? (
              user.skillsWanted.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </div>
        </div>

        {/* 🔥 MATCH BAR */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users size={16} className="text-blue-700" />
              <span>Swap Score</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {user.matchPercentage || 0}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`${getColor(user.matchPercentage)} h-2 transition-all duration-500`}
              style={{ width: `${user.matchPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* 🔥 ACTION BUTTONS */}
        <div className="flex gap-3">

          {/* ❌ SKIP */}
          <button
            onClick={handleSkip}
            disabled={loading || status === "skipped"}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-200 text-gray-900 py-2 rounded-xl font-medium transition disabled:opacity-50"
          >
            <X size={16} />
            {status === "skipped" ? "Skipped" : "Skip"}
          </button>

          {/* ❤️ REQUEST */}
          <button
            onClick={handleRequest}
            disabled={loading || status === "sent"}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition disabled:opacity-50"
          >
            <Heart size={16} />
            {status === "sent" ? "Sent" : "Request"}
          </button>

        </div>

      </div>
    </motion.div>
  );
};

export default UserCard;

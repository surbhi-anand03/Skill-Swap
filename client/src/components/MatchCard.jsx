import React from "react";
import { FaComments, FaCalendarAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const MatchCard = ({ user }) => {
  return (
<div className="bg-gray-100 rounded-2xl shadow-xl p-7 w-96 relative hover:shadow-2xl hover:-translate-y-1 transition">

  {/* 🔥 Badge */}
  <span className="absolute top-5 left-5 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
    Matched
  </span>

  {/* 👤 User Info */}
  <div className="flex items-center gap-5 mt-7">

    {/* Avatar */}
    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
      {user.image ? (
        <img
          src={user.image}
          alt="user"
          className="w-full h-full object-cover"
        />
      ) : (
        <FaUserCircle className="text-gray-400 text-6xl" />
      )}
    </div>

    <div>
      <h3 className="font-bold text-2xl">
        {user.name || "Anonymous"}
      </h3>
      <p className="text-gray-500 text-base">
        {user.bio || "No bio available"}
      </p>
    </div>

  </div>

  <hr className="mt-4" />

  {/* 🔘 Buttons */}
  <div className="flex gap-4 mt-5">
    <button className="flex items-center justify-center gap-2 flex-1 bg-blue-600 text-white py-3 rounded-xl text-base hover:bg-blue-700 transition">
      <FaComments />
      Chat
    </button>

    <button className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 text-white py-3 rounded-xl text-base hover:bg-indigo-700 transition">
      <FaCalendarAlt />
      Book
    </button>
  </div>

</div>
  );
};

export default MatchCard;
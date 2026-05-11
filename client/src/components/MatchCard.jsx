import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SessionModal from "./SessionModal";

const MatchCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-100 rounded-2xl shadow-xl p-6 w-80">

        {/* USER INFO */}
        <div className="flex gap-4 items-center">
          {user.image ? (
            <img
              src={user.image}
              alt="profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <FaUserCircle className="text-5xl text-gray-400" />
          )}

          <div>
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.bio}</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4">

          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Book Session
          </button>

          <button
            onClick={() => navigate(`/chat/${user._id}`)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Chat
          </button>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <SessionModal
          user={user}
          close={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MatchCard;
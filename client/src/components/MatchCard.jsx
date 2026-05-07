import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { createSession } from "../api/api";
import SessionModal from "./SessionModal";

const MatchCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-gray-100 rounded-2xl shadow-xl p-6 w-80">

        {/* USER INFO */}
        <div className="flex gap-4 items-center">
          {user.image ? (
            <img src={user.image} className="w-16 h-16 rounded-full" />
          ) : (
            <FaUserCircle className="text-5xl text-gray-400" />
          )}

          <div>
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.bio}</p>
          </div>
        </div>

        {/* BOOK BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
        >
          Book Session
        </button>
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
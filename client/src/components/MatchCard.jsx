import React, { useState } from "react";
import {
  FaUserCircle,
  FaBookOpen,
  FaGraduationCap,
  FaExchangeAlt,
  FaRegCommentDots,
  FaCalendarAlt,
  FaUserLock,
  FaCheck,
} from "react-icons/fa";

import SessionModal from "./SessionModal";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ user }) => {
  const [showModal, setShowModal] =
    useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden">
        <div className="p-8">
          {/* MATCHED BADGE */}
          <div className="absolute top-6 right-6">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md">
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <FaCheck className="text-green-400 text-[10px]" />
              </span>
              Matched
            </span>
          </div>

          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* USER INFO */}
            <div className="flex gap-5">
              {/* PROFILE IMAGE */}
              <div className="relative shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaUserCircle className="text-7xl text-indigo-600" />
                  </div>
                )}
              </div>

              {/* USER DETAILS */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {user?.name}
                </h2>

                {/* BIO */}
                <p className="text-indigo-600 text-xl mt-2 max-w-2xl">
                  {user?.bio ||
                    "Passionate learner and skill sharer"}
                </p>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-slate-200 my-8"></div>

          {/* SKILL SWAP SECTION */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* SKILLS OFFERED */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaBookOpen className="text-green-600 text-lg" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {user?.name} Can Teach
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Skills shared by{" "}
                    {user?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(
                  user?.skillsOffered ||
                  user?.skills ||
                  []
                ).length > 0 ? (
                  (
                    user?.skillsOffered ||
                    user?.skills ||
                    []
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">
                    No skills added
                  </p>
                )}
              </div>
            </div>

            {/* CENTER ICON */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                <FaExchangeAlt className="text-slate-500 text-xl" />
              </div>
            </div>

            {/* SKILLS WANTED */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                  <FaGraduationCap className="text-violet-600 text-lg" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {user?.name} Wants to
                    Learn
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Skills{" "}
                    {user?.name} wants
                    to learn
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(user?.skillsWanted ||
                  []).length > 0 ? (
                  (
                    user?.skillsWanted ||
                    []
                  ).map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={index}
                        className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl text-sm font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-slate-400 text-sm">
                    No learning goals
                    added
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="grid md:grid-cols-2 gap-5 mt-10">
            {/* BOOK SESSION */}
            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 text-lg shadow-md hover:shadow-lg"
            >
              <FaCalendarAlt />
              Book a Session
            </button>

            {/* MESSAGE BUTTON */}
            <button
              onClick={() =>
                navigate(
                  `/chat/${user?._id}`
                )
              }
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
            >
              <FaRegCommentDots />
              Send a Message
            </button>
          </div>

          {/* PRIVACY NOTE */}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-5">
            <FaUserLock className="text-slate-500" />
            <p>
              Contact details stay
              private until you start
              a conversation.
            </p>
          </div>
        </div>
      </div>

      {/* SESSION MODAL */}
      {showModal && (
        <SessionModal
          user={user}
          close={() =>
            setShowModal(false)
          }
        />
      )}
    </>
  );
};

export default MatchCard;
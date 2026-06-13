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
    <div
      className="
        bg-white rounded-[28px]
        shadow-sm hover:shadow-lg
        border border-slate-200
        overflow-hidden
        transition-all duration-300
      "
    >
      <div className="p-4 sm:p-6 lg:p-8">

        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">

          {/* PROFILE IMAGE */}
          <div className="shrink-0 mx-auto sm:mx-0">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="
                  w-24 h-24
                  sm:w-28 sm:h-28
                  rounded-full
                  object-cover
                  border-4 border-violet-200
                  shadow-sm
                "
              />
            ) : (
              <div
                className="
                  w-24 h-24
                  sm:w-28 sm:h-28
                  rounded-full
                  bg-violet-100
                  flex items-center justify-center
                "
              >
                <FaUserCircle className="text-6xl text-violet-600" />
              </div>
            )}
          </div>

          {/* USER DETAILS */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2
              className="
                text-2xl sm:text-3xl
                font-bold text-slate-900
                break-words
              "
            >
              {user?.name}
            </h2>

            <p
              className="
                text-violet-600
                text-sm sm:text-base
                mt-2
                line-clamp-3
              "
            >
              {user?.bio ||
                "Passionate learner and skill sharer"}
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-200 my-5"></div>

        {/* SKILL SWAP */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1fr_auto_1fr]
            gap-6 lg:gap-8
            items-start
          "
        >
          {/* SKILLS OFFERED */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <FaBookOpen className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-lg text-slate-900">
                  {user?.name} Can Teach
                </h3>

                <p className="text-slate-500 text-sm">
                  Skills shared by {user?.name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(user?.skillsOffered ||
                user?.skills ||
                []).length > 0 ? (
                (
                  user?.skillsOffered ||
                  user?.skills ||
                  []
                ).map((skill, index) => (
                  <span
                    key={index}
                    className="
                      bg-blue-100 text-blue-700
                      px-3 py-2
                      rounded-xl
                      text-xs sm:text-sm
                      font-medium
                    "
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
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <FaExchangeAlt className="text-slate-500 text-xl" />
            </div>
          </div>

          {/* SKILLS WANTED */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <FaGraduationCap className="text-violet-600" />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-lg text-slate-900">
                  {user?.name} Wants to Learn
                </h3>

                <p className="text-slate-500 text-sm">
                  Skills to learn
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(user?.skillsWanted || []).length >
              0 ? (
                user?.skillsWanted.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="
                        bg-violet-100 text-violet-700
                        px-3 py-2
                        rounded-xl
                        text-xs sm:text-sm
                        font-medium
                      "
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-slate-400 text-sm">
                  No learning goals added
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            gap-3 sm:gap-5
            mt-8
          "
        >
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="
              bg-violet-600 hover:bg-violet-700
              text-white
              py-3 sm:py-4
              rounded-2xl
              font-semibold
              flex items-center justify-center gap-3
              transition
              text-sm sm:text-base
            "
          >
            <FaCalendarAlt />
            Book a Session
          </button>

          <button
            onClick={() =>
              navigate(`/chat/${user?._id}`)
            }
            className="
              border border-violet-600
              text-violet-600
              hover:bg-violet-600
              hover:text-white
              py-3 sm:py-4
              rounded-2xl
              font-semibold
              flex items-center justify-center gap-3
              transition
              text-sm sm:text-base
            "
          >
            <FaRegCommentDots />
            Send a Message
          </button>
        </div>

        {/* PRIVACY */}
        <div
          className="
            flex items-start sm:items-center
            justify-center gap-2
            text-slate-500
            text-xs sm:text-sm
            mt-5
            text-center
          "
        >
          <FaUserLock className="mt-1 sm:mt-0 shrink-0" />

          <p>
            Contact details stay private
            until you start a conversation.
          </p>
        </div>
      </div>
    </div>

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
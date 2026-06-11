import { motion } from "framer-motion";
import { useState } from "react";
import {
  sendRequest,
  respondRequest,
} from "../api/api";

import {
  UserPlus,
  Check,
  X,
} from "lucide-react";

import {
  FaUserGraduate,
  FaBook,
  FaRocket,
} from "react-icons/fa";

const UserCard = ({
  user,
  refresh,
}) => {
  const [loading, setLoading] =
    useState(false);

  const getState = () => {
    if (
      user.requestStatus ===
        "pending" &&
      !user.isSender
    )
      return "incoming";

    if (
      user.requestStatus ===
        "pending" &&
      user.isSender
    )
      return "sent";

    return "default";
  };

  const state = getState();

  const handleRequest =
    async () => {
      try {
        setLoading(true);

        await sendRequest(
          user._id
        );

        refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  const handleRespond =
    async (action) => {
      try {
        setLoading(true);

        await respondRequest(
          user.requestId,
          action
        );

        refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="
        w-[300px]
        bg-white
        rounded-[28px]
        border
        border-slate-200
        shadow-md
        p-6
        transition
        hover:shadow-xl
      "
    >
      {/* PROFILE IMAGE */}
      <div className="flex justify-center">
        <div
          className="
            w-28
            h-28
            rounded-full
            overflow-hidden
            border-[5px]
            border-violet-200
            shadow-md
          "
        >
          {user?.profileImage ? (
            <img
              src={
                user.profileImage
              }
              alt="profile"
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-full
                h-full
                bg-violet-500
                flex
                items-center
                justify-center
                text-white
                text-4xl
                font-bold
              "
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* NAME */}
      <div className="text-center mt-5">
        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          {user.name}
        </h2>

        {/* BIO */}
        <div
          className="
            flex
            justify-center
            items-start
            gap-2
            mt-3
          "
        >
          <FaUserGraduate
            className="
              text-violet-600
              mt-1
              shrink-0
            "
            size={18}
          />

          <p
            className="
              text-violet-600
              text-[16px]
              leading-7
              font-medium
              max-w-[240px]
            "
          >
            {user.bio ||
              "SkillSwap Member"}
          </p>
        </div>
      </div>

      <hr className="my-5" />

      {/* SKILLS WANTED */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FaBook
            className="text-violet-600"
            size={17}
          />

          <h4
            className="
              font-bold
              text-black
              text-sm
            "
          >
            Skills Want
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {(user.skillsWanted ||
            [])
            .slice(0, 2)
            .map(
              (
                skill,
                index
              ) => (
                <span
                  key={index}
                  className="
                    bg-violet-100
                    text-violet-700
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  {skill}
                </span>
              )
            )}
        </div>
      </div>

      {/* SKILLS OFFERED */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-3">
          <FaRocket
            className="text-violet-600"
            size={17}
          />

          <h4
            className="
              font-bold
              text-black
              text-sm
            "
          >
            Skills Offer
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {(user.skillsOffered ||
            user.skills ||
            [])
            .slice(0, 2)
            .map(
              (
                skill,
                index
              ) => (
                <span
                  key={index}
                  className="
                    bg-violet-100
                    text-violet-700
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  {skill}
                </span>
              )
            )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6">
        {state ===
          "default" && (
          <button
            onClick={
              handleRequest
            }
            disabled={
              loading
            }
            className="
              w-full
              bg-violet-200
              text-violet-600
              border border-violet-600
              py-3
              rounded-2xl
              font-semibold
              hover:bg-violet-600
              hover:text-white
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <UserPlus
              size={18}
            />
            Connect
          </button>
        )}

        {state ===
          "sent" && (
          <button
            disabled
            className="
              w-full
              bg-yellow-400
              text-white
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Pending
          </button>
        )}

        {state ===
          "incoming" && (
          <div className="flex gap-3">
            <button
              onClick={() =>
                handleRespond(
                  "accepted"
                )
              }
              className="
                flex-1
                bg-green-500
                text-white
                py-3
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Check size={18} />
              Accept
            </button>

            <button
              onClick={() =>
                handleRespond(
                  "ignored"
                )
              }
              className="
                flex-1
                bg-red-500
                text-white
                py-3
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <X size={18} />
              Ignore
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;


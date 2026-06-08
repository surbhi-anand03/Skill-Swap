import { motion } from "framer-motion";
import { useState } from "react";
import {
  sendRequest,
  skipUser,
  respondRequest,
} from "../api/api";

import {
  UserPlus,
  Trophy,
  Check,
  X,
  Clock,
} from "lucide-react";


const UserCard = ({ user, refresh }) => {
  const [loading, setLoading] = useState(false);

  const getState = () => {
    if (user.requestStatus === "pending" && !user.isSender)
      return "incoming";

    if (user.requestStatus === "pending" && user.isSender)
      return "sent";

    if (user.requestStatus === "skipped")
      return "skipped";

    return "default";
  };

  const state = getState();

  const handleRequest = async () => {
    try {
      setLoading(true);
      await sendRequest(user._id);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setLoading(true);
      await skipUser(user._id);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (action) => {
    try {
      setLoading(true);
      await respondRequest(user.requestId, action);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="w-[360px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="h-36 bg-gradient-to-r from-purple-200 via-purple-100 to-pink-100 relative">


        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2 text-purple-700 font-semibold text-sm">
          <Trophy size={16} />
          Matched: {user.swapScore || 0}/10
        </div>

        {/* Avatar */}
        {/* <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        </div> */}

        <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
          <div
            className="
              w-24
              h-24
              rounded-full
              overflow-hidden
              bg-gradient-to-r
              from-purple-600
              to-violet-500
              flex
              items-center
              justify-center
              text-white
              text-4xl
              font-bold
              border-4
              border-white
              shadow-lg
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
              user.name
                ?.charAt(0)
                ?.toUpperCase()
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-16 px-6 pb-6">

        <h2 className="text-3xl font-bold text-center text-gray-900">
          {user.name}
        </h2>

        <p className="text-center text-purple-600 mt-1 text-lg">
          {user.bio || "SkillSwap Member"}
        </p>

        <hr className="my-3" />

        {/* Skills Offered */}
        <div>
          <h4 className="font-semibold text-green-600 mb-3">
            Skills Offered:
          </h4>

          <div className="flex flex-wrap gap-2">
            {(user.skillsOffered || user.skills || []).map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-5">
          <h4 className="font-semibold text-blue-600 mb-3">
            Skills Wanted:
          </h4>

          <div className="flex flex-wrap gap-2">
            {(user.skillsWanted || []).map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        <hr className="my-3" />

        {/* Buttons */}
        <div className="flex gap-6">

          {state === "default" && (
            <>
              {/* <button
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <X size={18} />
                  Skip
                </div>
              </button> */}

              <button
                onClick={handleRequest}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-500 text-white py-3 rounded-xl font-medium shadow-md hover:opacity-90 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Connect
                </div>
              </button>
            </>
          )}

          {state === "sent" && (
            <>
              <button
                disabled
                className="flex-1 bg-yellow-400 text-white py-3 rounded-xl font-medium"
              >
                Pending
              </button>

              <button
                onClick={handleSkip}
                className="flex-1 border border-gray-300 py-3 rounded-xl"
              >
                Skip
              </button>
            </>
          )}

          {state === "skipped" && (
            <button
              onClick={handleRequest}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-500 text-white py-3 rounded-xl font-medium"
            >
              Connect
            </button>
          )}

          {state === "incoming" && (
            <>
              <button
                onClick={() => handleRespond("accepted")}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <Check size={18} />
                  Accept
                </div>
              </button>

              <button
                onClick={() => handleRespond("ignored")}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium"
              >
                Ignore
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
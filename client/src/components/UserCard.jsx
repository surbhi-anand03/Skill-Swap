// export default UserCard;
import { motion } from "framer-motion";
import { useState } from "react";
import {
  sendRequest,
  skipUser,
  respondRequest,
} from "../api/api";

const UserCard = ({ user, refresh }) => {
  const [loading, setLoading] = useState(false);

  // 🔥 DETERMINE STATE
  const getState = () => {
    if (user.requestStatus === "pending" && !user.isSender) return "incoming";
    if (user.requestStatus === "pending" && user.isSender) return "sent";
    if (user.requestStatus === "skipped") return "skipped";
    return "default";
  };

  const state = getState();

  // ❤️ SEND REQUEST
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

  // ❌ SKIP
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

  // ✅ ACCEPT / IGNORE
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
    <motion.div className="bg-white rounded-2xl shadow p-5 w-80">

      <h2 className="font-bold text-lg">{user.name}</h2>
      <p className="text-gray-500 text-sm mb-3">{user.bio}</p>

      {/* 🔥 BUTTONS */}
      <div className="flex gap-2">

        {/* DEFAULT */}
        {state === "default" && (
          <>
            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Skip
            </button>

            <button
              onClick={handleRequest}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              Send Request
            </button>
          </>
        )}

        {/* SENT */}
        {state === "sent" && (
          <>
            <button
              disabled
              className="flex-1 bg-yellow-400 text-white py-2 rounded"
            >
              Pending
            </button>

            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-400 py-2 rounded"
            >
              Skip
            </button>
          </>
        )}

        {/* SKIPPED */}
        {state === "skipped" && (
          <button
            onClick={handleRequest}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Send Request
          </button>
        )}

        {/* INCOMING */}
        {state === "incoming" && (
          <>
            <button
              onClick={() => handleRespond("accepted")}
              className="flex-1 bg-green-500 text-white py-2 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleRespond("ignored")}
              className="flex-1 bg-red-500 text-white py-2 rounded"
            >
              Ignore
            </button>
          </>
        )}

      </div>
    </motion.div>
  );
};

export default UserCard;
import { useEffect, useState } from "react";
import {
  getSessions,
  acceptSession,
  rejectSession,
  joinSession,
} from "../api/api";

export default function Sessions() {
  // inside Sessions component
  const currentUserId = localStorage.getItem("userId");
  const [data, setData] = useState({
    pending: [],
    upcoming: [],
    completed: [],
  });

  const fetchSessions = async () => {
    try {
      const res = await getSessions();
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAccept = async (id) => {
    await acceptSession(id);
    fetchSessions();
  };

  const handleReject = async (id) => {
    await rejectSession(id);
    fetchSessions();
  };

  const handleJoin = async (id) => {
    const res = await joinSession(id);
    window.open(res.data.meetingLink, "_blank");
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Sessions
      </h2>

      {/* 🔹 PENDING */}
      <h3 className="text-lg font-semibold mb-3">Pending</h3>
      {/* {data.pending.map((s) => (
        <div key={s._id} className="bg-white p-3 shadow mb-2 flex justify-between">
          <p>
            {s.users.map(u => u.name).join(", ")}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(s._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(s._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))} */}

      {data.pending.map((s) => {
        const isCreator = s.createdBy === currentUserId;

        return (
          <div
            key={s._id}
            className="bg-white p-3 shadow mb-2 flex justify-between"
          >
            <p>{s.users.map((u) => u.name).join(", ")}</p>

            <div className="flex gap-2">

              {/* ✅ Creator sees waiting */}
              {isCreator ? (
                <span className="text-gray-500 text-sm">
                  Waiting for response...
                </span>
              ) : (
                <>
                  {/* ✅ Only receiver sees buttons */}
                  <button
                    onClick={() => handleAccept(s._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(s._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* 🔹 UPCOMING */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Upcoming</h3>
      {data.upcoming.map((s) => (
        <div key={s._id} className="bg-white p-3 shadow mb-2 flex justify-between">
          <p>{s.users.map(u => u.name).join(", ")}</p>

          <button
            onClick={() => handleJoin(s._id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Join
          </button>
        </div>
      ))}

      {/* 🔹 COMPLETED */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Completed</h3>
      {data.completed.map((s) => (
        <div key={s._id} className="bg-gray-200 p-3 mb-2">
          {s.users.map(u => u.name).join(", ")}
        </div>
      ))}

    </div>
  );
}
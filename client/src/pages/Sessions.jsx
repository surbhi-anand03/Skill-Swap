import { useEffect, useState } from "react";

import {
  getSessions,
  acceptSession,
  rejectSession,
  joinSession,
  completeSession,
} from "../api/api";

export default function Sessions() {

  const [data, setData] = useState({
    pending: [],
    upcoming: [],
    completed: [],
  });

  const userId = localStorage.getItem("userId");

  const fetchSessions = async () => {
    try {
      const res = await getSessions();

      setData(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ================= ACCEPT ================= */

  const handleAccept = async (id) => {
    try {

      await acceptSession(id);

      fetchSessions();

    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  /* ================= REJECT ================= */

  const handleReject = async (id) => {
    try {

      await rejectSession(id);

      fetchSessions();

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= JOIN ================= */

  // const handleJoin = async (id) => {
  //   try {

  //     const res = await joinSession(id);

  //     window.open(
  //       res.data.meetingLink,
  //       "_blank"
  //     );

  //   } catch (err) {
  //     alert(err.response.data.message);
  //   }
  // };

  const handleJoin = async (id) => {
    try {
      const res = await joinSession(id);

      window.open(res.data.meetingLink, "_blank");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Cannot join session"
      );
    }
  };

  /* ================= COMPLETE ================= */

  const handleComplete = async (id) => {
    try {

      await completeSession(id);

      fetchSessions();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold text-center mb-8">
        Sessions
      </h2>

      {/* ================= PENDING ================= */}

      <h3 className="text-xl font-semibold mb-4">
        Pending
      </h3>

      {data.pending.map((s) => {

        const isCreator =
          s.createdBy === userId;

        return (
          <div
            key={s._id}
            className="bg-white shadow p-4 rounded mb-4"
          >

            <p className="font-semibold">
              {s.users.map(u => u.name).join(", ")}
            </p>

            <p className="text-sm text-gray-500">
              {s.type}
            </p>

            {s.scheduledDate && (
              <p className="text-sm text-gray-500">
                {new Date(
                  s.scheduledDate
                ).toLocaleDateString()}
                {" "}
                {s.startTime}
              </p>
            )}

            <div className="mt-3">

              {isCreator ? (

                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Waiting...
                </button>

              ) : (

                <div className="flex gap-3">

                  <button
                    onClick={() => handleAccept(s._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(s._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>

          </div>
        );
      })}

      {/* ================= UPCOMING ================= */}

      <h3 className="text-xl font-semibold mt-8 mb-4">
        Upcoming
      </h3>

      {data.upcoming.map((s) => (

        <div
          key={s._id}
          className="bg-white shadow p-4 rounded mb-4"
        >

          <p className="font-semibold">
            {s.users.map(u => u.name).join(", ")}
          </p>

          <p className="text-sm text-gray-500">
            {s.type}
          </p>

          {s.scheduledDate && (
            <p className="text-sm text-gray-500">
              {new Date(
                s.scheduledDate
              ).toLocaleDateString()}
              {" "}
              {s.startTime}
            </p>
          )}

          <div className="flex gap-3 mt-3">

            <button
              onClick={() => handleJoin(s._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Join
            </button>

            <button
              onClick={() => handleComplete(s._id)}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              End Session
            </button>

          </div>

        </div>
      ))}

      {/* ================= COMPLETED ================= */}

      <h3 className="text-xl font-semibold mt-8 mb-4">
        Completed
      </h3>

      {data.completed.map((s) => (

        <div
          key={s._id}
          className="bg-gray-100 shadow p-4 rounded mb-4"
        >

          <p className="font-semibold">
            {s.users.map(u => u.name).join(", ")}
          </p>

          <p className="text-sm">
            Type: {s.type}
          </p>

          {s.scheduledDate && (
            <p className="text-sm">
              Date:
              {" "}
              {new Date(
                s.scheduledDate
              ).toLocaleDateString()}
            </p>
          )}

          <p className="text-sm">
            Duration:
            {" "}
            {s.duration || "0 mins"}
          </p>

          <p className="text-sm">
            Completed At:
            {" "}
            {new Date(
              s.updatedAt
            ).toLocaleString()}
          </p>

        </div>
      ))}

    </div>
  );
}
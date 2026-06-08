import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getSessions,
  acceptSession,
  rejectSession
} from "../api/api";

import {
  Calendar,
  CheckCircle,
  Clock3,
  Video,
  Zap,
  X,
  Check
} from "lucide-react";

export default function Sessions() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    pending: [],
    upcoming: [],
    completed: [],
  });

  const userId =
    localStorage.getItem("userId");

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

  const canJoin = (session) => {
    if (
      session.sessionType === "instant"
    ) {
      return true;
    }

    const start =
      new Date(session.startTime);

    const now = new Date();

    const diff =
      (start - now) / 60000;

    return diff <= 10;
  };

  const handleJoin = (id) => {
    navigate(`/video/${id}`);
  };

  /* ================= AVATAR ================= */

  const getAvatar = (host, participant) => {
    const first =
      host?.name?.charAt(0) || "";

    const second =
      participant?.name?.charAt(0) || "";

    return `${first}${second}`.toUpperCase();
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-slate-900">
          Sessions
        </h1>

        <p className="text-slate-500 mt-2 text-lg">
          Manage your teaching and
          learning sessions
        </p>
      </div>

      {/* ================= PENDING ================= */}

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Clock3
            className="text-yellow-500"
            size={24}
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Pending
            </h2>

            <p className="text-slate-500">
              You have{" "}
              {data.pending.length}{" "}
              pending request
              {data.pending.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.pending.length ===
          0 ? (
            <div className="border border-dashed border-yellow-300 bg-yellow-50 p-14 text-center">
              <Clock3
                className="mx-auto text-yellow-400 mb-3"
                size={40}
              />

              <h3 className="font-semibold text-xl">
                No Pending
                sessions
              </h3>

            </div>
          ) : (
            data.pending.map((s) => {
              const isCreator =
                s.hostUser?._id ===
                userId;

              return (
                <div
                  key={s._id}
                  className="bg-white border border-slate-200 border-l-4 border-l-yellow-500 p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center">

                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getAvatar(
                          s.hostUser,
                          s.participantUser
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-xl text-slate-900">
                          {
                            s.hostUser
                              ?.name
                          }{" "}
                          &{" "}
                          {
                            s
                              .participantUser
                              ?.name
                          }
                        </h3>

                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                          <Zap
                            size={14}
                          />
                          <span>
                            {s.sessionType ===
                            "instant"
                              ? "Instant Session"
                              : "Scheduled Session"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                      {isCreator ? (
                        <button className="bg-yellow-100 text-yellow-700 px-5 py-2 font-medium">
                          Waiting for
                          response
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleAccept(
                                s._id
                              )
                            }
                            className="bg-green-100 text-green-700 px-5 py-2 flex items-center gap-2 font-medium"
                          >
                            <Check
                              size={18}
                            />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleReject(
                                s._id
                              )
                            }
                            className="bg-red-100 text-red-600 px-5 py-2 flex items-center gap-2 font-medium"
                          >
                            <X
                              size={18}
                            />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= UPCOMING ================= */}

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Calendar
            className="text-blue-600"
            size={24}
          />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Upcoming
            </h2>

            <p className="text-slate-500">
              You have{" "}
              {
                data.upcoming.length
              }{" "}
              upcoming session
              {data.upcoming.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.upcoming.length ===
          0 ? (
            <div className="border border-dashed border-blue-300 bg-blue-50 p-14 text-center">
              <Calendar
                className="mx-auto text-blue-500 mb-4"
                size={40}
              />

              <h3 className="font-semibold text-xl">
                No upcoming
                sessions
              </h3>

              <p className="text-slate-500 mt-2">
                Your scheduled
                sessions will appear
                here.
              </p>
            </div>
          ) : (
            data.upcoming.map(
              (s) => (
                <div
                  key={s._id}
                  className="bg-white border border-slate-200 border-l-4 border-l-blue-600 p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center">

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getAvatar(
                          s.hostUser,
                          s.participantUser
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-xl">
                          {
                            s.hostUser
                              ?.name
                          }{" "}
                          &{" "}
                          {
                            s
                              .participantUser
                              ?.name
                          }
                        </h3>

                        <p className="text-slate-500">
                          {new Date(
                            s.startTime
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      disabled={
                        !canJoin(
                          s
                        )
                      }
                      onClick={() =>
                        handleJoin(
                          s._id
                        )
                      }
                      className={`px-6 py-3 text-white flex items-center gap-2 font-medium ${
                        canJoin(s)
                          ? "bg-blue-600"
                          : "bg-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Video
                        size={18}
                      />
                      {canJoin(s)
                        ? "Join"
                        : "Available 10 mins before"}
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>

      {/* ================= COMPLETED ================= */}

      <section>
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle
            className="text-green-600"
            size={24}
          />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Completed
            </h2>

            <p className="text-slate-500">
              You have{" "}
              {
                data.completed.length
              }{" "}
              completed sessions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.completed.map(
            (s) => (
              <div
                key={s._id}
                className="bg-white border border-slate-200 border-l-4 border-l-green-500 p-6 shadow-sm"
              >
                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getAvatar(
                        s.hostUser,
                        s.participantUser
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-xl">
                        {
                          s.hostUser
                            ?.name
                        }{" "}
                        &{" "}
                        {
                          s
                            .participantUser
                            ?.name
                        }
                      </h3>

                      <p className="text-slate-500 text-sm mt-1">
                        Duration:{" "}
                        {s.duration ||
                          "0 mins"}
                        {" • "}
                        Completed:{" "}
                        {new Date(
                          s.updatedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <CheckCircle className="text-green-500" />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
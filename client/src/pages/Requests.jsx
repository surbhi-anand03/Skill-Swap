import { useEffect, useState } from "react";
import {
  getAllRequests,
  respondRequest,
  sendRequest,
} from "../api/api";

import {
  Inbox,
  Send,
  Lightbulb,
  BellRing,
  ArrowRight,
} from "lucide-react";

export default function Requests() {
  const [incoming, setIncoming] =
    useState([]);

  const [sent, setSent] =
    useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res =
        await getAllRequests();

      setIncoming(
        res.data.incoming || []
      );

      setSent(
        res.data.pendingSent || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (
    id,
    action
  ) => {
    try {
      await respondRequest(
        id,
        action
      );

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async (
    userId
  ) => {
    try {
      await sendRequest(userId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderSkillSwap = (
    offered = [],
    wanted = []
  ) => {
    return (
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {(offered || []).map(
          (skill, index) => (
            <span
              key={`offer-${index}`}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          )
        )}

        {(offered.length > 0 ||
          wanted.length > 0) && (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100">
            <ArrowRight
              size={18}
              className="text-slate-600"
            />
          </div>
        )}

        {(wanted || []).map(
          (skill, index) => (
            <span
              key={`want-${index}`}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 flex items-center gap-5">

          <div >
            <BellRing
              className="text-violet-500"
              size={40}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Requests
            </h1>

            <p className="text-slate-500 text-lg mt-1">
              Manage your incoming and
              sent requests.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* INCOMING */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-7">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                  <Inbox className="text-yellow-600" />
                </div>

                <h2 className="text-2xl font-bold">
                  Incoming
                </h2>
              </div>

              <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
                {incoming.length}
              </span>
            </div>

            {incoming.length === 0 ? (
              <div className="border border-slate-200 rounded-[28px] py-20 flex flex-col items-center text-center">

                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-5">
                  <Inbox className="text-violet-600" />
                </div>

                <h3 className="font-semibold text-xl">
                  No incoming requests
                </h3>

                <p className="text-slate-500 mt-2">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {incoming.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-4">

                      <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-lg font-bold text-violet-700">
                        {req.sender?.name?.charAt(
                          0
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">
                          {
                            req.sender?.name
                          }
                        </h3>

                        {renderSkillSwap(
                          req.sender
                            ?.skillsOffered ||
                            req.sender
                              ?.skills ||
                            [],
                          req.sender
                            ?.skillsWanted ||
                            []
                        )}

                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-4 flex-wrap">

                          <button
                            onClick={() =>
                              handleAction(req._id, "accepted")
                            }
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ✓ Accept
                          </button>

                          <button
                            onClick={() =>
                              handleAction(req._id, "ignored")
                            }
                            className="flex items-center gap-2 border border-red-500 hover:bg-red-400 text-red-500 hover:text-black px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ✕ Ignore
                          </button>

                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SENT */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-7">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <Send className="text-pink-600" />
                </div>

                <h2 className="text-2xl font-bold">
                  Sent
                </h2>
              </div>

              <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
                {sent.length}
              </span>
            </div>

            {sent.length === 0 ? (
              <div className="border border-slate-200 rounded-[28px] py-20 flex flex-col items-center text-center">

                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-5">
                  <Send className="text-violet-600" />
                </div>

                <h3 className="font-semibold text-xl">
                  No sent requests
                </h3>

                <p className="text-slate-500 mt-2">
                  You haven't sent any
                  requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {sent.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-4">

                      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-lg font-bold text-pink-700">
                        {req.receiver?.name?.charAt(
                          0
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">
                          {
                            req.receiver
                              ?.name
                          }
                        </h3>

                        {renderSkillSwap(
                          req.receiver
                            ?.skillsOffered ||
                            req.receiver
                              ?.skills ||
                            [],
                          req.receiver
                            ?.skillsWanted ||
                            []
                        )}

                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-4 flex-wrap">

                          <button
                            onClick={() =>
                              handleResend(req.receiver?._id)
                            }
                            className="flex items-center gap-2 bg-violet-500 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ↻ Resend
                          </button>

                          <button
                            onClick={() =>
                              handleAction(req._id, "skipped")
                            }
                            className="flex items-center gap-2 border border-slate-500 hover:bg-slate-300 text-black px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            ✕ Skip
                          </button>

                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TIP */}
            <div className="mt-8 bg-indigo-50 rounded-3xl p-5 flex gap-3 items-start">
              <Lightbulb className="text-indigo-500 mt-1" />

              <p className="text-slate-600 text-sm">
                <span className="font-semibold">
                  Tip:
                </span>{" "}
                Be clear about what you want
                to learn and what you can
                teach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
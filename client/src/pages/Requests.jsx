import { useEffect, useState } from "react";
import {
  getAllRequests,
  respondRequest,
} from "../api/api";


import {
  FaUsers,
  FaInbox,
  FaPaperPlane,
} from "react-icons/fa";

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

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900">
            <FaUsers className="text-violet-600 text-3xl" />
            Requests
          </h1>

          <p className="text-slate-500 text-base mt-1">
            Manage your incoming and
            outgoing requests
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">

          {/* RECEIVED */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Received Requests
                <span className="text-violet-600 ml-2">
                  ({incoming.length})
                </span>
              </h2>
            </div>

            {incoming.length === 0 ? (
              // <div className="p-8 text-center text-slate-500">
              //   No received requests
              // </div>
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                  <FaInbox className="text-4xl text-violet-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  No Received Requests
                </h3>

                <p className="text-slate-500 mt-2 max-w-sm">
                  You don't have any pending requests yet.
                  Explore users and connect with people who
                  match your skills.
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/discover")
                  }
                  className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition"
                >
                  Explore Users
                </button>
              </div>
            ) : (
              incoming.map((req, index) => (
                <div
                  key={req._id}
                  // className={`grid lg:grid-cols-[1.8fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center ${
                  className={`group
                    grid lg:grid-cols-[1.8fr_1fr_1fr_auto]
                    gap-4 px-5 py-5 items-center
                    hover:bg-violet-50
                    hover:scale-[1.01]
                    transition-all duration-300
                  `}
                >
                 
                  {/* USER INFO */}
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0">
                      {req.sender
                        ?.profileImage ? (
                        <img
                          src={
                            req.sender
                              .profileImage
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-violet-500 text-white flex items-center justify-center font-bold">
                          {req.sender?.name?.charAt(
                            0
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[17px] text-slate-900">
                        {
                          req.sender
                            ?.name
                        }
                      </h3>

                      <p className="text-[13px] text-violet-700 leading-5 mt-1 line-clamp-2">
                        {req.sender
                          ?.bio ||
                          "SkillSwap Member"}
                      </p>
                    </div>
                  </div>

                  {/* SKILLS WANTED */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Wants
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.sender
                          ?.skillsWanted ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-violet-100 text-violet-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* SKILLS OFFERED */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Offers
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.sender
                          ?.skillsOffered ||
                        req.sender
                          ?.skills ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "accepted"
                        )
                      }
                      className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "ignored"
                        )
                      }
                      className="border border-violet-400 text-violet-600 hover:bg-violet-200 px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SENT */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Sent Requests
                <span className="text-blue-600 ml-2">
                  ({sent.length})
                </span>
              </h2>
            </div>

            {sent.length === 0 ? (
              // <div className="p-8 text-center text-slate-500">
              //   No sent requests
              // </div>
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-4xl text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  No Sent Requests
                </h3>

                <p className="text-slate-500 mt-2 max-w-sm">
                  You haven't sent any connection requests yet.
                  Discover new users and start building your
                  SkillSwap network.
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/discover")
                  }
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                >
                  Find Skill Partners
                </button>
              </div>
            ) : (
              sent.map((req, index) => (
                <div
                  key={req._id}
                  // className={`grid lg:grid-cols-[1.8fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center ${
                  className={`group
                    grid lg:grid-cols-[1.8fr_1fr_1fr_auto]
                    gap-4 px-5 py-5 items-center
                    hover:bg-blue-50
                    hover:scale-[1.01]
                    transition-all duration-300
                    `}
                  >
                
                  {/* USER INFO */}
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0">
                      {req.receiver
                        ?.profileImage ? (
                        <img
                          src={
                            req.receiver
                              .profileImage
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {req.receiver?.name?.charAt(
                            0
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[17px] text-slate-900">
                        {
                          req.receiver
                            ?.name
                        }
                      </h3>

                      <p className="text-[13px] text-blue-700 leading-5 mt-1 line-clamp-2">
                        {req.receiver
                          ?.bio ||
                          "SkillSwap Member"}
                      </p>
                    </div>
                  </div>

                  {/* WANTS */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Wants
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.receiver
                          ?.skillsWanted ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* OFFERS */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Offers
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.receiver
                          ?.skillsOffered ||
                        req.receiver
                          ?.skills ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* SKIP */}
                  <button
                    onClick={() =>
                      handleAction(
                        req._id,
                        "ignored"
                      )
                    }
                    className="border border-blue-400 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Skip
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
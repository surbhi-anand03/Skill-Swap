import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaSearch,
  FaUsers,
  FaVideo,
  FaPaperPlane,
  FaUserCircle,
  FaBook,
  FaBookmark,
  FaCalendarAlt,
  FaChevronRight,
  FaArrowRight,
  FaClock,
  FaChartLine,
  FaFire,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [, setPending] = useState([]);
  const [sessions, setSessions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
  }, []);

//   useEffect(() => {
//   const fetchDashboard = async () => {
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   };

//   fetchDashboard();
// }, [token]);

  const fetchDashboard = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        profileRes,
        matchRes,
        pendingRes,
        sessionRes,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/user/profile",
          { headers }
        ),
        axios.get(
          "http://localhost:5000/api/user/matches",
          { headers }
        ),
        axios.get(
          "http://localhost:5000/api/request/pending",
          { headers }
        ),
        axios.get(
          "http://localhost:5000/api/session/my",
          { headers }
        ),
      ]);

      setProfile(profileRes.data);
      setMatches(matchRes.data);
      setPending(pendingRes.data);

      setSessions([
        ...(sessionRes.data.upcoming || []),
        ...(sessionRes.data.pending || []),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const getOtherUserName = (session) => {
    if (!profile?._id || !session) return "";

    return session.hostUser?._id === profile._id
      ? session.participantUser?.name
      : session.hostUser?.name;
  };

  const getInitials = (name = "") => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const cards = [
    {
      title: "Discover",
      description:
        "Find learners & skill partners",
      icon: <FaSearch size={24} />,
      route: "/discover",
      color:
        "bg-purple-100 text-purple-600",
    },
    {
      title: "Matches",
      description:
        "See your skill connections",
      icon: <FaUsers size={24} />,
      route: "/matches",
      color:
        "bg-green-100 text-green-600",
    },
    {
      title: "Sessions",
      description:
        "Manage upcoming sessions",
      icon: <FaVideo size={24} />,
      route: "/sessions",
      color:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Requests",
      description:
        "Track pending requests",
      icon: <FaPaperPlane size={24} />,
      route: "/requests",
      color:
        "bg-orange-100 text-orange-600",
    },
    {
      title: "Profile",
      description:
        "Manage your information",
      icon: <FaUserCircle size={24} />,
      route: "/profile",
      color:
        "bg-violet-100 text-violet-600",
    },
  ];

  const profileFields = [
  profile?.name,
  profile?.bio,
  profile?.skillsOffered?.length,
  profile?.skillsWanted?.length,
];

const completedFields =
  profileFields.filter(Boolean).length;

const profileCompletion = Math.round(
  (completedFields / 4) * 100
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f9f8ff] to-violet-50 p-8">

      <div className="grid xl:grid-cols-[1fr_360px] gap-8">

        {/* LEFT SIDE */}
        <div>

          {/* HEADER */}
          <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100">

            <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">

              <div>
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center">
                    <FaFire
                      className="text-[#6C63FF]"
                    />
                  </div>

                  <span className="text-sm text-gray-500 font-medium">
                    SkillSwap Dashboard
                  </span>
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome back,{" "}
                  <span className="text-[#6C63FF]">
                    {profile?.name ||
                      "Learner"}
                  </span>
                </h1>

                <p className="text-gray-500 mt-4 text-lg max-w-2xl leading-8">
                  Connect, learn, and grow
                  with people who share your
                  passion for skills and
                  knowledge.
                </p>
              </div>

              {/* Profile Card */}
              <div className="bg-[#f7f6ff] rounded-[30px] p-5 min-w-[270px] border border-violet-100">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center text-xl font-bold">
                    {getInitials(
                      profile?.name
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {profile?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Skill Learner
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          "/profile"
                        )
                      }
                      className="text-[#6C63FF] text-sm font-medium mt-1"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {profileCompletion < 100 && (
  <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-[32px] p-8 text-white shadow-lg">

    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

      <div>
        <p className="text-white/80 text-sm font-medium">
          PROFILE COMPLETION
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Complete Your Profile
        </h2>

        <p className="mt-3 text-white/90 max-w-lg">
          A complete profile helps you get better matches,
          more skill exchange opportunities, and increased visibility.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">

    {!profile?.bio && (
      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
        Add Bio
      </span>
    )}

    {!profile?.skillsOffered?.length && (
      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
        Add Skills Offered
      </span>
    )}

    {!profile?.skillsWanted?.length && (
      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
        Add Skills Wanted
      </span>
    )}

  </div>
      </div>

      <div className="flex items-center gap-6">

        {/* Progress Circle */}
        <div className="relative w-28 h-28">

          <svg className="w-28 h-28 -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="10"
              fill="none"
            />

            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="white"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="289"
              strokeDashoffset={
                289 -
                (289 * profileCompletion) / 100
              }
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
            {profileCompletion}%
          </div>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="
            bg-white
            text-violet-700
            font-semibold
            px-6
            py-3
            rounded-2xl
            hover:scale-105
            transition
          "
        >
          Complete Now
        </button>

      </div>

    </div>

  </div>
)}

          {/* ACTIVITY */}
          <div className="mt-10">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Activity
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaChartLine />
                Dashboard Analytics
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* CARD 1 */}
              <div className="bg-white rounded-[30px] p-7 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Skills You Teach
                    </p>

                    <h2 className="text-5xl font-bold mt-4 text-gray-900">
                      {profile
                        ?.skillsOffered
                        ?.length || 0}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <FaBook
                      className="text-[#6C63FF]"
                      size={25}
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="bg-white rounded-[30px] p-7 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Skills To Learn
                    </p>

                    <h2 className="text-5xl font-bold mt-4 text-gray-900">
                      {profile
                        ?.skillsWanted
                        ?.length || 0}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                    <FaBookmark
                      className="text-green-600"
                      size={25}
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="bg-white rounded-[30px] p-7 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Sessions
                      Completed
                    </p>

                    <h2 className="text-5xl font-bold mt-4 text-gray-900">
                      {sessions.length}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <FaCalendarAlt
                      className="text-blue-600"
                      size={25}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="mt-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Explore
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {cards.map((card) => (
                <div
                  key={card.title}
                  onClick={() =>
                    navigate(card.route)
                  }
                  className="group bg-white rounded-[32px] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start">

                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.color}`}
                    >
                      {card.icon}
                    </div>

                    <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-[#6C63FF] group-hover:text-white group-hover:border-[#6C63FF] transition">
                      <FaArrowRight />
                    </button>
                  </div>

                  <div className="mt-7">

                    <h3 className="text-xl font-bold text-gray-900">
                      {card.title}
                    </h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      {
                        card.description
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* UPCOMING SESSION */}
          <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 p-7">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Session
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Your next scheduled learning
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/sessions")
                }
                className="text-[#6C63FF] font-medium hover:underline"
              >
                View all
              </button>
            </div>

            {sessions.length > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[28px] p-6 border border-green-100">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                    <FaVideo size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {sessions[0]?.skill}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Session Scheduled
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  <div className="flex items-center gap-3 text-gray-700">
                    <FaUsers className="text-green-600" />
                    <span>
                      With{" "}
                      {getOtherUserName(
                        sessions[0]
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <FaClock className="text-green-600" />
                    <span>
                      {new Date(
                        sessions[0]?.startTime
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/sessions")
                  }
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition"
                >
                  Join Session
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[28px] p-8 text-center">

                <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-slate-500" />
                </div>

                <p className="text-gray-600 font-medium">
                  No upcoming sessions
                </p>

                <button
                  onClick={() =>
                    navigate("/discover")
                  }
                  className="mt-4 text-[#6C63FF] font-medium"
                >
                  Explore Skills →
                </button>
              </div>
            )}
          </div>

          {/* RECENT MATCHES */}
          <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 p-7">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Matches
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Your latest skill partners
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/matches")
                }
                className="text-[#6C63FF] font-medium hover:underline"
              >
                View all
              </button>
            </div>

            {matches.length > 0 ? (
              matches
                .slice(0, 4)
                .map((m) => (
                  <div
                    key={m._id}
                    onClick={() =>
                      navigate("/matches")
                    }
                    className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition cursor-pointer mb-3 border border-transparent hover:border-slate-100"
                  >

                    <div className="flex items-center gap-4">

                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center font-bold text-lg">
                        {getInitials(
                          m.name
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {m.name}
                        </h3>

                        <p className="text-[#6C63FF] text-sm mt-1">
                          {m.skillsWanted?.[0] ||
                            "Skill Match"}
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <FaChevronRight className="text-slate-500" />
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-10">

                <FaUsers
                  size={35}
                  className="mx-auto text-gray-300"
                />

                <p className="text-gray-500 mt-4">
                  No matches yet
                </p>
              </div>
            )}
          </div>

          {/* MOTIVATION CARD */}
          <div className="bg-gradient-to-br from-[#6C63FF] to-violet-600 rounded-[35px] p-8 text-white shadow-lg">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <FaFire />
              </div>

              <h2 className="text-xl font-bold">
                Keep Growing
              </h2>
            </div>

            <p className="text-white/90 leading-8 text-lg">
              “The beautiful thing about
              learning is that no one can
              take it away from you.”
            </p>

            <p className="mt-6 text-white/80 font-medium">
              — SkillSwap Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
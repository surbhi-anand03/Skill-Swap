import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getMatches } from "../api/api";

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
  FaHandshake,
  FaUserGraduate,
  FaLightbulb,
  FaEdit,
  FaRocket,
  FaHandsHelping,
  FaCheckCircle,
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

  useEffect(() => {
  console.log("MATCH STATE:", matches);
}, [matches]);

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

      console.log(profile);
      console.log(matches);
      console.log("MATCHES:", matchRes.data);

      setSessions(sessionRes.data.upcoming || []);
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

  const getOtherUser = (session) => {
  if (!profile?._id || !session) return null;

  return session.hostUser?._id === profile._id
    ? session.participantUser
    : session.hostUser;
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

const getOtherUserBio = (session) => {
  if (!profile?._id || !session) return "";

  return session.hostUser?._id === profile._id
    ? session.participantUser?.bio
    : session.hostUser?.bio;
};

  return (

<div className="w-full min-h-screen bg-slate-50 pt-0 lg:pt-6 pb-24 lg:pb-6 px-3 sm:px-4 md:px-5 lg:px-6 overflow-hidden">
<div className="bg-white rounded-[24px] lg:rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-200">
  {/* <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_420px] gap-5 lg:gap-8 items-start"> */}
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-[minmax(0,1fr)_320px]
        xl:grid-cols-[minmax(0,1.3fr)_340px]
        2xl:grid-cols-[minmax(0,1.4fr)_360px]
        gap-6
        lg:gap-8
        items-start
        w-full
      "
    >
    {/* LEFT SIDE */}
    <div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">

        <div className="bg-violet-100 p-4 rounded-3xl">
          <FaRocket className="text-violet-600 text-2xl" />
        </div>

        <div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight break-words">
            Welcome, <span className="text-violet-600">{profile?.name || "SkillSwap Member"}</span>
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base lg:text-lg">
            Track your learning journey, connect with
            partners and grow your skills.
          </p>
        </div>
      </div>

      {/* QUICK STATS */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8"> */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-8">

        <div onClick={() => navigate("/profile")} className="bg-violet-50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-violet-100 hover:bg-violet-100 cursor-pointer transition">
          <FaBook className="text-violet-600 text-2xl mb-3" />

          <h2 className="text-3xl font-bold">
            {profile?.skillsOffered?.length || 0}
          </h2>

          <p className="text-slate-500 text-sm">
            Skills Offered
          </p>
        </div>

        <div  onClick={() => navigate("/profile")} className="bg-green-50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-green-100 hover:bg-green-100 cursor-pointer transition">
          <FaUserGraduate className="text-green-600 text-2xl mb-3" />

          <h2 className="text-3xl font-bold">
            {profile?.skillsWanted?.length || 0}
          </h2>

          <p className="text-slate-500 text-sm">
            Skills Wanted
          </p>
        </div>

        <div onClick={() => navigate("/matches")} className="bg-blue-50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-blue-100 hover:bg-blue-100 cursor-pointer transition">
          <FaHandshake className="text-blue-600 text-2xl mb-3" />

          <h2 className="text-3xl font-bold">
            {matches.length}
          </h2>

          <p className="text-slate-500 text-sm">
            Swaps
          </p>
        </div>

        <div  onClick={() => navigate("/sessions")} className="bg-orange-50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-orange-100 hover:bg-orange-100 cursor-pointer transition">
          <FaCalendarAlt className="text-orange-600 text-2xl mb-3" />

          <h2 className="text-2xl sm:text-3xl font-bold">
            {sessions.length}
          </h2>

          <p className="text-slate-500 text-sm">
            Sessions
          </p>
        </div>

      </div>

      {/* PROFILE STATUS */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

          {/* <div className="flex items-center gap-3"> */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {profileCompletion === 100 ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaLightbulb className="text-red-500 text-xl" />
            )}

            <h3 className="font-bold text-lg text-slate-800">
              {profileCompletion === 100
                ? "Profile Completed"
                : "Complete Your Profile"}
            </h3>
          </div>

          <span
            className={`
              self-start sm:self-auto px-3 py-1 rounded-full text-xs sm:text-sm font-semibold
              ${
                profileCompletion === 100
                  ? "bg-green-100 text-green-700"
                  : "bg-violet-100 text-violet-700"
              }
            `}
          >
            {profileCompletion}% Complete
          </span>
        </div>
        {/* Progress Bar - Hide when 100% */}

        {profileCompletion < 100 && (
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-5">
            <div
              className="
                h-full rounded-full transition-all duration-500
                bg-violet-500
              "
              style={{
                width: `${profileCompletion}%`,
              }}
            />
          </div>
        )}

        {/* Completed */}
        {profileCompletion === 100 ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <p className="text-green-700 font-medium">
              🎉 Great! You have completed your profile.
              Learners can now easily connect with you.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 mb-4">
              Complete the missing information to improve
              your profile visibility.
            </p>

            <div className="flex flex-wrap gap-2">

              {!profile?.name && (
                <span className="bg-white text-violet-700 border border-violet-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                  Add Name
                </span>
              )}

              {!profile?.bio && (
                <span className="bg-white text-orange-700 border border-orange-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                  Add Bio
                </span>
              )}

              {!profile?.skillsOffered?.length && (
                <span className="bg-white text-blue-700 border border-blue-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                  Add Skills Offered
                </span>
              )}

              {!profile?.skillsWanted?.length && (
                <span className="bg-white text-green-700 border border-green-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                  Add Skills Wanted
                </span>
              )}
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="
                mt-5 bg-red-600 text-white
                px-5 py-3 rounded-2xl
                font-semibold hover:bg-red-700
                transition
              "
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">

        <button
          onClick={() => navigate("/discover")}
          className="flex items-center justify-center gap-2 border border-violet-300 bg-violet-600 text-white hover:bg-violet-800 px-5 sm:px-7 py-3 sm:py-4 rounded-2xl font-semibold  transition w-full sm:w-auto"
        >
          <FaRocket />
          Explore Users
        </button>

        <button
          onClick={() => navigate("/matches")}
          className="flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 sm:px-7 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-slate-200 transition w-full sm:w-auto"
        >
          <FaUsers />
          Your Swaps
        </button>

      </div>
    </div>

    {/* RIGHT PROFILE CARD */}
    {/* <div className="bg-gradient-to-br from-white to-slate-50 rounded-[24px] sm:rounded-[28px] border border-slate-200 p-4 sm:p-6 lg:p-7 shadow-md overflow-hidden"> */}
<div className="min-w-0 w-full bg-gradient-to-br from-white to-slate-50 rounded-[24px] sm:rounded-[28px] border border-slate-200 p-4 sm:p-6 lg:p-7 shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">

        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-slate-200">

          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-violet-100 flex items-center justify-center">
              <FaUserCircle className="text-7xl text-violet-600" />
            </div>
          )}

        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {profile?.name}
          </h2>

          <p className="text-violet-500">
            {profile?.bio || "SkillSwap Member"}
          </p>
        </div>

      </div>

      {/* Skills */}
      <div className="mt-7">

        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <FaBook className="text-green-600" />
          Skills Offered
        </h3>

        <div className="flex flex-wrap gap-2 mt-3">
          {profile?.skillsOffered?.map((skill, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>

      <div className="mt-5">

        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <FaUserGraduate className="text-violet-600" />
          Skills Wanted
        </h3>

        <div className="flex flex-wrap gap-2 mt-3">
          {profile?.skillsWanted?.map((skill, i) => (
            <span
              key={i}
              className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>

      <button
        onClick={() => navigate("/profile")}
        className="w-full mt-8 bg-white text-violet-700 border border-violet-700 py-4 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-violet-100 transition"
      >
        <FaArrowRight />
        View Profile
      </button>

    </div>
</div>
</div>

  {/* STATS */}
  {/* <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8"> */}

    {/* Skills Offered */}


  {/* MAIN GRID */}
{/* MAIN GRID */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mt-5 sm:mt-6">
{/* RECENT CONNECTIONS */}
<div className="bg-white rounded-[28px] border border-violet-100 shadow-sm p-4 sm:p-6 h-fit">
  {/* Header */}
  <div className="flex items-start justify-between gap-3 mb-5">

    <div className="flex items-center gap-3 min-w-0">
      <div className="bg-violet-100 p-3 rounded-2xl shrink-0">
        <FaHandshake className="text-violet-600 text-lg sm:text-xl" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-violet-700 leading-tight">
        Recent Connections
      </h2>
    </div>

    <button
      onClick={() => navigate("/matches")}
      className="text-violet-600 font-semibold text-sm sm:text-base whitespace-nowrap"
    >
      View All
    </button>
  </div>

  <div className="space-y-4">
    {matches.length > 0 ? (
      matches.slice(0, 4).map((item) => {
        const user = item.user || item;

        return (
          <div
            key={user._id}
            className="
              bg-gradient-to-br from-violet-50 to-purple-50
              border border-violet-200
              rounded-[28px]
              p-4 sm:p-5
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-center gap-4">

              {/* Profile */}
              <div className="shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="
                      w-16 h-16 sm:w-20 sm:h-20
                      rounded-2xl
                      object-cover
                      border-2 border-violet-200
                    "
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-200 flex items-center justify-center">
                    <FaUserCircle className="text-4xl text-violet-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-violet-700 truncate">
                  {user.name}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base line-clamp-2 mt-1">
                  {user.bio || "No bio added yet"}
                </p>
              </div>

            </div>
          </div>
        );
      })
    ) : (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FaHandshake className="text-5xl text-violet-300 mb-4" />

        <h3 className="text-lg font-semibold text-slate-700">
          Start Connecting
        </h3>

        <p className="text-slate-500 text-sm mt-2">
          You don’t have any connections yet.
        </p>

        <button
          onClick={() => navigate("/discover")}
          className="mt-5 px-5 py-3 rounded-2xl bg-violet-600 text-white hover:bg-violet-700 transition"
        >
          Find Skill Partners
        </button>
      </div>
    )}
  </div>
</div>

    {/* SESSIONS */}
{/* UPCOMING SESSIONS */}
<div className="bg-white rounded-[28px] border border-violet-100 shadow-sm p-4 sm:p-6 h-fit">
  {/* Header */}
  <div className="flex items-start justify-between gap-3 mb-5">

    <div className="flex items-center gap-3 min-w-0">
      <div className="bg-blue-100 p-3 rounded-2xl shrink-0">
        <FaCalendarAlt className="text-blue-600 text-lg sm:text-xl" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-blue-700 leading-tight">
        Upcoming Sessions
      </h2>
    </div>

    <button
      onClick={() => navigate("/sessions")}
      className="text-blue-600 font-semibold text-sm sm:text-base whitespace-nowrap"
    >
      View All
    </button>
  </div>

  <div className="space-y-4">
    {sessions.length > 0 ? (
      sessions.slice(0, 4).map((session) => {
        const otherUser = getOtherUser(session);

        return (
          <div
            key={session._id}
            className="
              bg-gradient-to-br from-blue-50 to-sky-50
              border border-blue-200
              rounded-[30px]
              p-4 sm:p-5
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-center gap-4">

              {/* Image */}
              <img
                src={otherUser?.profileImage}
                alt="profile"
                className="
                  w-16 h-16 sm:w-20 sm:h-20
                  rounded-2xl
                  object-cover
                  border-2 border-blue-300
                  shrink-0
                "
              />

              {/* Content */}
              <div className="flex-1 min-w-0">

                <h3 className="text-lg sm:text-xl font-bold text-blue-700 truncate">
                  {otherUser?.name}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base line-clamp-1 mt-1">
                  {otherUser?.bio || "No bio added yet"}
                </p>

                {/* Date Card */}
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-3
                    px-3 py-2
                    rounded-2xl
                    text-xs sm:text-sm
                    font-medium
                    bg-blue-100
                    text-blue-700
                    border border-blue-200
                  "
                >
                  <FaCalendarAlt className="text-blue-600" />

                  <span>
                    {session.startTime
                      ? new Date(
                          session.startTime
                        ).toLocaleString()
                      : "Instant Session"}
                  </span>
                </div>

              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FaCalendarAlt className="text-5xl text-blue-300 mb-4" />

        <h3 className="text-lg font-semibold text-slate-700">
          Start Session Journey
        </h3>

        <p className="text-slate-500 text-sm mt-2">
          No upcoming sessions yet.
        </p>

        <button
          onClick={() => navigate("/matches")}
          className="mt-5 px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Create First Session
        </button>
      </div>
    )}
  </div>
</div>

  </div>

</div>
);
}
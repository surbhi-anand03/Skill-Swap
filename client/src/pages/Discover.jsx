import { useEffect, useState } from "react";
import {
  getMatches,
  sendRequest,
  skipUser,
} from "../api/api";

import UserCard from "../components/UserCard";

import {
  Sparkles,
  Users,
  Compass,
  Send,
} from "lucide-react";

import {
  FaBookOpen,
  FaRocket,
} from "react-icons/fa";

const Discover = () => {
  const [recommended, setRecommended] =
    useState([]);

  const [explore, setExplore] =
    useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getMatches();

      setRecommended(
        res.data.recommended || []
      );

      setExplore(
        res.data.allUsers || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (
    id
  ) => {
    try {
      await sendRequest(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async (
    id
  ) => {
    try {
      await skipUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove recommended users
  const exploreFiltered =
    explore.filter(
      (user) =>
        !recommended.some(
          (r) => r._id === user._id
        )
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* ================= RECOMMENDED USERS ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 mt-8 sm:mt-10 lg:mt-12">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div className="flex items-start sm:items-center gap-4">
            <Sparkles
              size={36}
              className="text-violet-600 shrink-0"
            />

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Recommended For You
              </h2>

              <p className="text-gray-600 text-sm sm:text-base mt-1">
                People you might connect
                and grow with
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center justify-center
              gap-2
              bg-violet-100
              text-violet-700
              border border-violet-300
              px-5 py-3
              rounded-full
              font-semibold
              w-fit
            "
          >
            <Users size={18} />
            {recommended.length} Users
          </div>
        </div>

        {/* EMPTY STATE */}
        {recommended.length ===
        0 ? (
          <div className="mt-8 sm:mt-10">
            <div
              className="
                bg-white
                rounded-[28px]
                border border-slate-200
                shadow-sm
                p-6 sm:p-10 lg:p-12
                text-center
              "
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center">
                <Sparkles
                  size={40}
                  className="text-violet-600"
                />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                No Recommendations Yet
              </h3>

              <p className="mt-3 text-slate-500 max-w-md mx-auto text-sm sm:text-base">
                We couldn't find any
                strong matches right
                now. Explore all users
                and discover new skill
                partners.
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() =>
                    document
                      .getElementById(
                        "explore-users"
                      )
                      ?.scrollIntoView(
                        {
                          behavior:
                            "smooth",
                        }
                      )
                  }
                  className="
                    flex items-center gap-2
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    px-6 py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  <Compass
                    size={18}
                  />
                  Find Skill Partners
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mt-8 sm:mt-10">
            {recommended.map(
              (user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  refresh={
                    fetchUsers
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* ================= EXPLORE USERS ================= */}
      {exploreFiltered.length >
        0 && (
        <div
          id="explore-users"
          className="
            max-w-7xl
            mx-auto
            px-3 sm:px-4 lg:px-5
            mt-12 sm:mt-16 lg:mt-20
          "
        >
          {/* HEADER */}
          <div className="flex items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <Compass
              size={34}
              className="text-blue-600 shrink-0"
            />

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Explore all Users
              </h2>

              <p className="text-gray-500 text-sm sm:text-base">
                Find even more skill
                partners
              </p>
            </div>
          </div>

          {/* USERS */}
          <div
            className="
              bg-white
              rounded-[28px]
              border border-slate-200
              shadow-sm
              overflow-hidden
            "
          >
            {exploreFiltered.map(
              (
                user,
                index
              ) => (
                <div
                  key={user._id}
                  className={`
                    grid
                    grid-cols-1
                    md:grid-cols-[2fr_1.4fr_1.4fr_auto]
                    gap-5 md:gap-6 lg:gap-8
                    items-start md:items-center
                    px-4 sm:px-6 lg:px-8
                    py-5
                    hover:bg-blue-50
                    transition
                    ${
                      index !==
                      exploreFiltered.length -
                        1
                        ? "border-b border-slate-200"
                        : ""
                    }
                  `}
                >
                  {/* USER INFO */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div
                      className="
                        w-16 h-16
                        rounded-full
                        overflow-hidden
                        bg-blue-100
                        shrink-0
                        border border-blue-400
                      "
                    >
                      {user?.profileImage ? (
                        <img
                          src={
                            user.profileImage
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                            w-full h-full
                            flex items-center
                            justify-center
                            bg-blue-600
                            text-white
                            font-bold
                            text-xl
                          "
                        >
                          {user?.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 truncate">
                        {user.name}
                      </h3>

                      <p className="text-blue-600 text-sm sm:text-base line-clamp-2">
                        {user.bio ||
                          "SkillSwap Member"}
                      </p>
                    </div>
                  </div>

                  {/* SKILLS WANTED */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaBookOpen className="text-blue-600" />

                      <p className="text-sm font-semibold text-black">
                        Skills Wanted
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(
                        user.skillsWanted ||
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
                              className="
                                bg-blue-100
                                text-blue-700
                                px-3 py-2
                                rounded-xl
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
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaRocket className="text-blue-600" />

                      <p className="text-sm font-semibold text-black">
                        Skills Offered
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(
                        user.skillsOffered ||
                        user.skills ||
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
                              className="
                                bg-blue-100
                                text-blue-700
                                px-3 py-2
                                rounded-xl
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

                  {/* CONNECT BUTTON */}
                  <button
                    onClick={() =>
                      handleConnect(
                        user._id
                      )
                    }
                    className="
                      flex items-center
                      justify-center
                      gap-2
                      w-full md:w-auto
                      bg-blue-100
                      border border-blue-700
                      text-blue-700
                      hover:bg-blue-700
                      hover:text-white
                      px-5 sm:px-7
                      py-3
                      rounded-2xl
                      font-semibold
                      transition
                      shadow-md
                    "
                  >
                    <Send
                      size={18}
                    />
                    Connect
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
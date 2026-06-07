import { useEffect, useState } from "react";
import { getMatches, likeUser, skipUser } from "../api/api";
import UserCard from "../components/UserCard";
import {
  Sparkles,
  Users,
  Compass,
} from "lucide-react";

const Discover = () => {
  const [recommended, setRecommended] = useState([]);
  const [explore, setExplore] = useState([]);

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

  const handleLike = async (id) => {
    try {
      await likeUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async (id) => {
    try {
      await skipUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const exploreFiltered = explore.filter(
    (user) =>
      !recommended.some(
        (r) => r._id === user._id
      )
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* HERO */}
      {/* <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1445] via-[#311b92] to-[#7c3aed] px-12 py-14">

          <div className="absolute -top-12 right-20 w-48 h-48 bg-purple-400/20 rounded-full"></div>

          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-400/20 rounded-full"></div>

          <div className="absolute bottom-8 right-52 grid grid-cols-6 gap-2 opacity-40">
            {Array.from({
              length: 24,
            }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-pink-400"
              />
            ))}
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl font-bold text-white">
              Discover Skill{" "}
              <span className="text-pink-300">
                Partners
              </span>
            </h1>

            <p className="text-white/90 text-lg mt-3">
              Connect with learners and mentors
              across the community.
            </p>
          </div>
        </div>
      </div> */}

      {/* RECOMMENDED */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="">
              <Sparkles
                size={35}
                className="text-violet-500 to-purple-600"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                Recommended For You
              </h2>

              <p className="text-gray-700">
                People you might connect and
                grow with
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 bg-violet-100 text-violet-700 px-5 py-3 rounded-full font-semibold">
            <Users size={18} />
            {recommended.length} Users
          </div>

        </div>

        <div className="flex flex-wrap gap-8 justify-center mt-10">
          {recommended.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              refresh={fetchUsers}
              onLike={handleLike}
              onSkip={handleSkip}
            />
          ))}
        </div>
      </div>

      {/* EXPLORE */}
      {exploreFiltered.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-20">

          <div className="flex items-center gap-4 mb-10">

            <div className="">
              <Compass
                size={35}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Explore More Users
              </h2>

              <p className="text-gray-500">
                Find even more skill partners
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {exploreFiltered.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                refresh={fetchUsers}
                onLike={handleLike}
                onSkip={handleSkip}
              />
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Discover;
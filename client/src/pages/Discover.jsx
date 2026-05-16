// export default Discover;
import { useEffect, useState } from "react";
import { getMatches, likeUser, skipUser } from "../api/api";
import UserCard from "../components/UserCard";
import { Sparkles, Compass } from "lucide-react";

const Discover = () => {
  const [recommended, setRecommended] = useState([]);
  const [explore, setExplore] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getMatches();
      setRecommended(res.data.recommended || []);
      setExplore(res.data.allUsers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      await likeUser(id);
      fetchUsers(); // refresh state
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
    (user) => !recommended.some((r) => r._id === user._id)
  );

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-8">

      {/* ⭐ RECOMMENDED */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles /> Recommended for You
        </h2>

        <div className="flex flex-wrap gap-6 justify-center">
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

      {/* 🌍 EXPLORE */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Compass /> Explore Users
        </h2>

        <div className="flex flex-wrap gap-6 justify-center">
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

    </div>
  );
};

export default Discover;
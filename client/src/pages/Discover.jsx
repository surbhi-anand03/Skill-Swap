import { useEffect, useState } from "react";
import { getMatches, likeUser, skipUser } from "../api/api";
import UserCard from "../components/UserCard";

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

// ❤️ LIKE
const handleLike = async (id) => {
try {
await likeUser(id);

  // ✅ instant UI update (no reload)
  setRecommended((prev) => prev.filter((u) => u._id !== id));
  setExplore((prev) => prev.filter((u) => u._id !== id));
} catch (err) {
  console.error(err);
}

};

// ❌ SKIP
const handleSkip = async (id) => {
try {
await skipUser(id);


  // ✅ instant UI update
  setRecommended((prev) => prev.filter((u) => u._id !== id));
  setExplore((prev) => prev.filter((u) => u._id !== id));
} catch (err) {
  console.error(err);
}

};

// ✅ remove duplicates from explore
const exploreFiltered = explore.filter(
(user) => !recommended.some((r) => r._id === user._id)
);

return ( <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">

  {/* ⭐ RECOMMENDED */}
  <h2 className="text-2xl font-bold mb-4">⭐ Recommended</h2>

  {recommended.length > 0 ? (
    <div className="flex flex-wrap gap-4 justify-center">
      {recommended.slice(0, 3).map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onLike={handleLike}
          onSkip={handleSkip}
        />
      ))}
    </div>
  ) : (
    <p>No recommended users</p>
  )}

  {/* 🌍 EXPLORE */}
  <h2 className="text-2xl font-bold mt-10 mb-4">🌍 Explore</h2>

  <div className="flex flex-wrap gap-4 justify-center">
    {exploreFiltered.length > 0 ? (
      exploreFiltered.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onLike={handleLike}
          onSkip={handleSkip}
        />
      ))
    ) : (
      <p>No more users</p>
    )}
  </div>

  {/* 🎉 EMPTY STATE */}
  {recommended.length === 0 && exploreFiltered.length === 0 && (
    <h2 className="text-xl mt-10">No more users 🎉</h2>
  )}

</div>


);
};

export default Discover;

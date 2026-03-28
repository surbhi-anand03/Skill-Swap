// import { useEffect, useState } from "react";
// import { getMatches, likeUser, skipUser } from "../api/api";
// import UserCard from "../components/UserCard";
// import { Sparkles, Compass } from "lucide-react";

// const Discover = () => {
//   const [recommended, setRecommended] = useState([]);
//   const [explore, setExplore] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getMatches();
//       setRecommended(res.data.recommended || []);
//       setExplore(res.data.allUsers || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ❤️ LIKE
//   const handleLike = async (id) => {
//     try {
//       await likeUser(id);

//       setRecommended((prev) => prev.filter((u) => u._id !== id));
//       setExplore((prev) => prev.filter((u) => u._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ❌ SKIP
//   const handleSkip = async (id) => {
//     try {
//       await skipUser(id);

//       setRecommended((prev) => prev.filter((u) => u._id !== id));
//       setExplore((prev) => prev.filter((u) => u._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ remove duplicates
//   const exploreFiltered = explore.filter(
//     (user) => !recommended.some((r) => r._id === user._id)
//   );

//   return (
//     <div className="bg-gray-50 min-h-screen px-6 py-8">

//       {/* ⭐ RECOMMENDED */}
//       <div className="w-full max-w-6xl mx-auto">
//         <div className="flex items-center gap-2 mb-6">
//           <Sparkles className="text-indigo-500" size={22} />
//           <h2 className="text-2xl font-bold text-gray-800">
//             Recommended for You
//           </h2>
//         </div>

//         {recommended.length > 0 ? (
//           <div className="flex flex-wrap gap-6 justify-center">
//             {recommended.slice(0, 3).map((user) => (
//               <UserCard
//                 key={user._id}
//                 user={user}
//                 onLike={handleLike}
//                 onSkip={handleSkip}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center">
//             No recommended users available
//           </p>
//         )}
//       </div>

//       {/* 🌍 EXPLORE */}
//       <div className="w-full max-w-6xl mx-auto mt-12">
//         <div className="flex items-center gap-2 mb-6">
//           <Compass className="text-blue-500" size={22} />
//           <h2 className="text-2xl font-bold text-gray-800">
//             Explore More Users
//           </h2>
//         </div>

//         {exploreFiltered.length > 0 ? (
//           <div className="flex flex-wrap gap-6 justify-center">
//             {exploreFiltered.map((user) => (
//               <UserCard
//                 key={user._id}
//                 user={user}
//                 onLike={handleLike}
//                 onSkip={handleSkip}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center">
//             No more users to explore
//           </p>
//         )}
//       </div>

//       {/* 🎉 EMPTY STATE */}
//       {recommended.length === 0 && exploreFiltered.length === 0 && (
//         <div className="flex flex-col items-center mt-16 text-gray-500">
//           <Sparkles size={40} className="mb-3 text-indigo-400" />
//           <h2 className="text-lg font-semibold">
//             You're all caught up!
//           </h2>
//           <p className="text-sm">Check back later for new users</p>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Discover;

import { useEffect, useState } from "react";
import { getMatches, likeUser, skipUser, sendRequest } from "../api/api";
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

  // 🚀 SEND REQUEST (NEW)
  const handleSendRequest = async (id) => {
    try {
      await sendRequest(id);

      // ✅ update UI without removing card
      const updateStatus = (list) =>
        list.map((u) =>
          u._id === id
            ? { ...u, requestStatus: "pending", isSender: true }
            : u
        );

      setRecommended((prev) => updateStatus(prev));
      setExplore((prev) => updateStatus(prev));
    } catch (err) {
      console.error(err);
    }
  };

  // ❤️ LIKE (keep but don't remove card)
  const handleLike = async (id) => {
    try {
      await likeUser(id);
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ SKIP (keep but don't remove card)
  const handleSkip = async (id) => {
    try {
      await skipUser(id);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ remove duplicates
  const exploreFiltered = explore.filter(
    (user) => !recommended.some((r) => r._id === user._id)
  );

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-8">

      {/* ⭐ RECOMMENDED */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-indigo-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-800">
            Recommended for You
          </h2>
        </div>

        {recommended.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {recommended.slice(0, 3).map((user) => (
              <div key={user._id} className="flex flex-col items-center gap-2">
                
                <UserCard
                  user={user}
                  onLike={handleLike}
                  onSkip={handleSkip}
                />

                {/* ✅ REQUEST BUTTON */}
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
                  onClick={() => handleSendRequest(user._id)}
                  disabled={user.requestStatus === "pending" && user.isSender}
                >
                  {user.requestStatus === "pending" && user.isSender
                    ? "Request Sent"
                    : user.requestStatus === "skipped"
                    ? "Send Request"
                    : "Send Request"}
                </button>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No recommended users available
          </p>
        )}
      </div>

      {/* 🌍 EXPLORE */}
      <div className="w-full max-w-6xl mx-auto mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="text-blue-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-800">
            Explore More Users
          </h2>
        </div>

        {exploreFiltered.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {exploreFiltered.map((user) => (
              <div key={user._id} className="flex flex-col items-center gap-2">
                
                <UserCard
                  user={user}
                  onLike={handleLike}
                  onSkip={handleSkip}
                />

                {/* ✅ REQUEST BUTTON */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={() => handleSendRequest(user._id)}
                  disabled={user.requestStatus === "pending" && user.isSender}
                >
                  {user.requestStatus === "pending" && user.isSender
                    ? "Request Sent"
                    : user.requestStatus === "skipped"
                    ? "Send Request"
                    : "Send Request"}
                </button>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No more users to explore
          </p>
        )}
      </div>

      {/* 🎉 EMPTY STATE */}
      {recommended.length === 0 && exploreFiltered.length === 0 && (
        <div className="flex flex-col items-center mt-16 text-gray-500">
          <Sparkles size={40} className="mb-3 text-indigo-400" />
          <h2 className="text-lg font-semibold">
            You're all caught up!
          </h2>
          <p className="text-sm">Check back later for new users</p>
        </div>
      )}

    </div>
  );
};

export default Discover;

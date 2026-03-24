// import { motion } from "framer-motion";
// import { Heart, X, User } from "lucide-react";

// const UserCard = ({ user, onLike, onSkip }) => {
//   const getColor = (percent) => {
//     if (percent > 75) return "bg-green-500";
//     if (percent > 40) return "bg-yellow-500";
//     return "bg-red-500";
//   };

//   return (
//     <motion.div
//       drag="x"
//       dragConstraints={{ left: 0, right: 0 }}
//       onDragEnd={(e, info) => {
//         if (info.offset.x > 120) onLike(user._id);
//         else if (info.offset.x < -120) onSkip(user._id);
//       }}
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="bg-white shadow-xl rounded-3xl w-80 overflow-hidden"
//     >

//       {/* 🔥 PROFILE HEADER */}
//       <div className="flex flex-col items-center p-6 bg-blue-300">

//         {user.profilePic ? (
//           <img
//             src={user.profilePic}
//             alt="profile"
//             className="w-28 h-28 rounded-full object-cover shadow-md"
//           />
//         ) : (
//           <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
//             <User size={40} className="text-gray-600" />
//           </div>
//         )}

//         <h2 className="mt-4 text-lg font-semibold">
//           {user.name || "No Name"}
//         </h2>

//         <p className="text-sm text-gray-700 text-center mt-1">
//           {user.bio || "No bio available"}
//         </p>
//       </div>

//       {/* 🔹 SKILLS SECTION */}
//       <div className="p-4">

//         {/* Offers */}
//         <div className="mb-2">
//           <p className="text-sm font-semibold">Offers:</p>
//           {user.skillsOffered?.length > 0 ? (
//             user.skillsOffered.map((s, i) => (
//               <span
//                 key={i}
//                 className="bg-green-100 text-green-700 px-2 py-1 mr-1 rounded text-xs"
//               >
//                 {s}
//               </span>
//             ))
//           ) : (
//             <p className="text-xs text-gray-400">None</p>
//           )}
//         </div>

//         {/* Wants */}
//         <div className="mb-3">
//           <p className="text-sm font-semibold">Wants:</p>
//           {user.skillsWanted?.length > 0 ? (
//             user.skillsWanted.map((s, i) => (
//               <span
//                 key={i}
//                 className="bg-blue-100 text-blue-700 px-2 py-1 mr-1 rounded text-xs"
//               >
//                 {s}
//               </span>
//             ))
//           ) : (
//             <p className="text-xs text-gray-400">None</p>
//           )}
//         </div>

//         {/* 🔥 MATCH BAR */}
//         <div className="mb-4">
//           <p className="text-xs font-semibold">
//             Match: {user.matchPercentage || 0}%
//           </p>

//           <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
//             <div
//               className={`${getColor(user.matchPercentage)} h-2 rounded-full`}
//               style={{ width: `${user.matchPercentage || 0}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* 🔥 ACTION BUTTONS */}
//         <div className="flex justify-between">
//           <button
//             onClick={() => onSkip(user._id)}
//             className="flex items-center gap-1 bg-gray-500 text-white px-4 py-1 rounded-lg text-sm"
//           >
//             <X size={16} />
//             Skip
//           </button>

//           <button
//             onClick={() => onLike(user._id)}
//             className="flex items-center gap-1 bg-blue-700 text-white px-4 py-1 rounded-lg text-sm"
//           >
//             <Heart size={16} />
//             Request
//           </button>
//         </div>

//       </div>
//     </motion.div>
//   );
// };

// export default UserCard;

import { motion } from "framer-motion";
import { Heart, X, User, Users, } from "lucide-react";


const UserCard = ({ user, onLike, onSkip }) => {
  const getColor = (percent) => {
    if (percent > 75) return "bg-green-500";
    if (percent > 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-3xl shadow-lg w-80 overflow-hidden transition"
    >

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 flex flex-col items-center text-white">

        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow">
            <User size={36} className="text-gray-500" />
          </div>
        )}

        <h2 className="mt-3 text-lg font-semibold">
          {user.name || "No Name"}
        </h2>

        <p className="text-sm opacity-90 text-center">
          {user.bio || "No bio available"}
        </p>
      </div>

      {/* 🔹 CONTENT */}
      <div className="p-5">

        {/* OFFERS */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Offers
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.length > 0 ? (
              user.skillsOffered.map((s, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </div>
        </div>

        {/* WANTS */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Wants
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.length > 0 ? (
              user.skillsWanted.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </div>
        </div>

        {/* 🔥 MODERN MATCH UI */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users  size={16} className="text-blue-700" />
              <span>Swap Score</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {user.matchPercentage || 0}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`${getColor(user.matchPercentage)} h-2 transition-all duration-500`}
              style={{ width: `${user.matchPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* 🔥 ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => onSkip(user._id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-200 text-gray-900 py-2 rounded-xl font-medium transition"
          >
            <X size={16} />
            Skip
          </button>

          <button
            onClick={() => onLike(user._id)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
          >
            <Heart size={16} />
            Request
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default UserCard;
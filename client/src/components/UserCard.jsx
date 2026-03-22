import { motion } from "framer-motion";

const UserCard = ({ user, onLike, onSkip }) => {

    const getColor = (percent) => {
        if (percent > 75) return "bg-green-500";
        if (percent > 40) return "bg-yellow-500";
        return "bg-red-500";
    };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}

      onDragEnd={(e, info) => {
        if (info.offset.x > 120) {
          onLike(user._id);
        } else if (info.offset.x < -120) {
          onSkip(user._id);
        }
      }}

      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}

      className="bg-white shadow-xl rounded-2xl p-6 w-80 cursor-grab"
    >

      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-500 mb-2">{user.bio}</p>

      <div>
        <p className="font-semibold">Offers:</p>
        {user.skillsOffered?.map((s, i) => (
          <span key={i} className="bg-green-100 px-2 py-1 mr-1 rounded text-sm">
            {s}
          </span>
        ))}
      </div>

      <div>
        <p className="font-semibold">Wants:</p>
        {user.skillsWanted?.map((s, i) => (
          <span key={i} className="bg-blue-100 px-2 py-1 mr-1 rounded text-sm">
            {s}
          </span>
        ))}
        <div className="mt-3">
            <p className="text-sm font-semibold">
                🔥 Match: {user.matchPercentage || 0}%
            </p>

            <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                <div
                    className={`${getColor(user.matchPercentage)} h-2 rounded-full`}
                    style={{ width: `${user.matchPercentage}%` }}
                ></div>
            </div>
            </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => onSkip(user._id)}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          ❌
        </button>

        <button
          onClick={() => onLike(user._id)}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          ❤️
        </button>
      </div>

    </motion.div>
  );
};

export default UserCard;

import { useEffect, useState } from "react";
import { getMatchesList } from "../api/api";
import MatchCard from "../components/MatchCard";
import { Handshake } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await getMatchesList();
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-green-100 p-2 rounded-full">
            <Handshake className="text-blue-600" size={35} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
            Your Matches
            </h2>
        </div>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No matches yet
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {matches.map((user) => (
            <MatchCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
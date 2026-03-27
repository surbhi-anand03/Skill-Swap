import { useEffect, useState } from "react";
import { getMatchesList, getIncomingRequests, getSentRequests } from "../api/api";
import MatchCard from "../components/MatchCard";
import { Handshake } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const matchRes = await getMatchesList();
      const incRes = await getIncomingRequests();
      const sentRes = await getSentRequests();

      setMatches(matchRes.data);
      setIncoming(incRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* MATCHES HEADER */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="bg-green-100 p-2 rounded-full">
          <Handshake className="text-blue-600" size={35} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Your Matches
        </h2>
      </div>

      {/* MATCHES LIST */}
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

      {/* ---------------- REQUESTS SECTION ---------------- */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Requests
        </h2>

        {/* INCOMING */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Incoming
          </h3>

          {incoming.length === 0 ? (
            <p className="text-gray-500">No incoming requests</p>
          ) : (
            incoming.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow p-3 rounded mb-2"
              >
                {req.sender?.name}
              </div>
            ))
          )}
        </div>

        {/* SENT */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Sent
          </h3>

          {sent.length === 0 ? (
            <p className="text-gray-500">No sent requests</p>
          ) : (
            sent.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow p-3 rounded mb-2"
              >
                {req.receiver?.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
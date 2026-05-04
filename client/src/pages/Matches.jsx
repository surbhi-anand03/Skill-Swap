
import { useEffect, useState } from "react";
import {
  getMatchesList
} from "../api/api";

import MatchCard from "../components/MatchCard";
import { Handshake } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  // const [incoming, setIncoming] = useState([]);
  // const [sent, setSent] = useState([]);

  // const currentUserId = localStorage.getItem("userId"); // ⚠️ important

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const matchRes = await getMatchesList();
      // const reqRes = await getAllRequests();

      setMatches(matchRes.data || []);
      // setIncoming(reqRes.data.incoming || []);
      // setSent(reqRes.data.pendingSent || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ACTIONS =================
  // const handleAction = async (id, action) => {
  //   try {
  //     await respondRequest(id, action);
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleResend = async (userId) => {
  //   try {
  //     await sendRequest(userId);
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // ================= UI =================
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="bg-green-100 p-2 rounded-full">
          <Handshake className="text-blue-600" size={35} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Your Matches
        </h2>
      </div>

      {/* ================= MATCHES LIST ================= */}
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No matches yet
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {/* {matches.map((r) => {
            // 🔥 FIX: correct user identify
            const user =
              r.sender._id === currentUserId
                ? r.receiver
                : r.sender;

            return <MatchCard key={r._id} user={user} />;
          })} */}

          {matches.map((user) => (
            <MatchCard key={user._id} user={user} />
          ))}

        </div>
      )}

      {/* ================= REQUESTS ================= */}

    </div>
  );
}
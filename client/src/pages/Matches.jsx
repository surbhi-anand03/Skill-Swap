import { useEffect, useState } from "react";
import {
  getMatchesList,
  getAllRequests,
  respondRequest,
  sendRequest,
} from "../api/api";

import MatchCard from "../components/MatchCard";
import { Handshake } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const matchRes = await getMatchesList();
      const reqRes = await getAllRequests();

      setMatches(matchRes.data || []);
      setIncoming(reqRes.data.incoming || []);
      setSent(reqRes.data.pendingSent || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ACTIONS =================
  const handleAction = async (id, action) => {
    try {
      await respondRequest(id, action);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async (userId) => {
    try {
      await sendRequest(userId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

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

      {/* REQUESTS SECTION */}
      <div className="mt-12 bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Requests
        </h2>

        {/* INCOMING */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Incoming
          </h3>

          {incoming.length === 0 ? (
            <p className="text-gray-500">
              No incoming requests
            </p>
          ) : (
            incoming.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow p-3 rounded mb-3 flex justify-between items-center"
              >
                <p className="font-medium">
                  {req.sender?.name}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req._id, "accepted")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleAction(req._id, "ignored")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SENT */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Sent
          </h3>

          {sent.length === 0 ? (
            <p className="text-gray-500">
              No sent requests
            </p>
          ) : (
            sent.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow p-3 rounded mb-3 flex justify-between items-center"
              >
                <p className="font-medium">
                  {req.receiver?.name}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleResend(req.receiver._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Resend
                  </button>

                  <button
                    onClick={() => handleAction(req._id, "skipped")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
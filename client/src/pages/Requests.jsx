import { useEffect, useState } from "react";
import { getAllRequests, respondRequest, sendRequest } from "../api/api";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllRequests();
      setIncoming(res.data.incoming || []);
      setSent(res.data.pendingSent || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Requests
      </h2>

      {/* 🔹 INCOMING */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Incoming</h3>

        {incoming.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          incoming.map((req) => (
            <div key={req._id} className="flex justify-between p-3 bg-white shadow rounded mb-2">
              <p>{req.sender?.name}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, "accepted")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleAction(req._id, "ignored")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Ignore
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔹 SENT */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Sent</h3>

        {sent.length === 0 ? (
          <p>No sent requests</p>
        ) : (
          sent.map((req) => (
            <div key={req._id} className="flex justify-between p-3 bg-white shadow rounded mb-2">
              <p>{req.receiver?.name}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResend(req.receiver._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Resend
                </button>

                <button
                  onClick={() => handleAction(req._id, "skipped")}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Skip
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
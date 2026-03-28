import { useEffect, useState } from "react";
import {
  getAllRequests,
  respondRequest,
  sendRequest,
} from "../api/api";

const Request = () => {
  const [data, setData] = useState({
    pendingSent: [],
    incoming: [],
    skipped: [],
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getAllRequests();
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ACCEPT / IGNORE / SKIP
  const handleAction = async (id, action) => {
    await respondRequest(id, action);
    fetchRequests();
  };

  // ✅ RESEND
  const handleResend = async (userId) => {
    await sendRequest(userId);
    fetchRequests();
  };

  return (
    <div className="p-6">

      {/* ================= PENDING ================= */}
      <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
      {data.pendingSent.map((r) => (
        <div key={r._id} className="border p-3 mb-2">
          <p>{r.receiver.name}</p>

          <button onClick={() => handleResend(r.receiver._id)}>
            Resend
          </button>

          <button onClick={() => handleAction(r._id, "skipped")}>
            Skip
          </button>
        </div>
      ))}

      {/* ================= INCOMING ================= */}
      <h2 className="text-xl font-bold mt-6 mb-4">Incoming Requests</h2>
      {data.incoming.map((r) => (
        <div key={r._id} className="border p-3 mb-2">
          <p>{r.sender.name}</p>

          <button onClick={() => handleAction(r._id, "accepted")}>
            Accept
          </button>

          <button onClick={() => handleAction(r._id, "ignored")}>
            Ignore
          </button>
        </div>
      ))}

      {/* ================= SKIPPED ================= */}
      <h2 className="text-xl font-bold mt-6 mb-4">Skipped</h2>
      {data.skipped.map((r) => (
        <div key={r._id} className="border p-3 mb-2">
          <p>
            {r.sender.name === r.receiver.name
              ? r.sender.name
              : r.sender.name}
          </p>

          <button onClick={() => handleResend(r.receiver._id)}>
            Send Request Again
          </button>
        </div>
      ))}
    </div>
  );
};

export default Request;

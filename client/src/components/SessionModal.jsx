import { useState } from "react";
import { createSession } from "../api/api";

export default function SessionModal({ user, close }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ⚡ Instant
  const handleInstant = async () => {
    try {
      await createSession({
        partnerId: user._id,
        type: "instant",
      });

      alert("Instant session created 🚀");
      close();
    } catch (err) {
      console.error(err);
      alert("Error creating session");
    }
  };

  // 📅 Scheduled
  const handleSchedule = async () => {
    if (!date || !time) {
      return alert("Select date & time");
    }

    try {
      await createSession({
        partnerId: user._id,
        type: "scheduled",
        scheduledDate: date,
        startTime: time,
      });

      alert("Session scheduled 📅");
      close();
    } catch (err) {
      console.error(err);
      alert("Error scheduling session");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-4">
          Book Session
        </h2>

        {/* ⚡ Instant */}
        <button
          onClick={handleInstant}
          className="w-full bg-green-500 text-white py-2 rounded mb-4"
        >
          Instant Session
        </button>

        {/* 📅 Schedule */}
        <div className="border p-3 rounded">

          <p className="font-semibold mb-2">
            Schedule Session
          </p>

          <input
            type="date"
            className="w-full border p-2 mb-2"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-2 mb-2"
            onChange={(e) => setTime(e.target.value)}
          />

          <button
            onClick={handleSchedule}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Book Scheduled
          </button>
        </div>

        {/* CLOSE */}
        <button
          onClick={close}
          className="mt-4 text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
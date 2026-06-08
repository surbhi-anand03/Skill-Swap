import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  X,
  Zap,
} from "lucide-react";

import { createSession } from "../api/api";

export default function SessionModal({
  user,
  close,
}) {
  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  // ⚡ Instant Session
  const handleInstant = async () => {
    try {
      await createSession({
        participantUser: user._id,
        sessionType: "instant",
        skill: "",
      });

      alert(
        "Instant session created 🚀"
      );

      close();
    } catch (err) {
      console.error(err);
      alert(
        "Error creating session"
      );
    }
  };

  // 📅 Schedule Session
  const handleSchedule =
    async () => {
      if (!date || !time) {
        return alert(
          "Select date & time"
        );
      }

      try {
        await createSession({
          participantUser:
            user._id,
          sessionType:
            "scheduled",
          startTime: new Date(
            `${date}T${time}`
          ),
        });

        alert(
          "Session scheduled 📅"
        );

        close();
      } catch (err) {
        console.error(err);
        alert(
          "Error scheduling session"
        );
      }
    };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-5 text-white flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Book Session
            </h2>

            <p className="text-sm text-indigo-100">
              Start instantly or
              schedule for later
            </p>
          </div>

          <button
            onClick={close}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">

          {/* ⚡ INSTANT SESSION */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-5 mb-5">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <Zap size={24} />
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Instant Session
                </h3>

                <p className="text-sm text-gray-500">
                  Start meeting now
                </p>
              </div>
            </div>

            <button
              onClick={
                handleInstant
              }
              className="w-full bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-2xl font-semibold shadow-md"
            >
              Start Instant Session
            </button>
          </div>

          {/* 📅 SCHEDULE SESSION */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-3xl p-5">
            
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Schedule Session
            </h3>

            {/* DATE */}
            <div className="mb-4">
              <label className="text-sm font-medium text-black mb-2 flex items-center gap-2">
                <CalendarDays
                  size={18}
                />
                Select Date
              </label>

              <input
                type="date"
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 bg-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
              />
            </div>

            {/* TIME */}
            <div className="mb-5">
              <label className="text-sm font-medium text-black mb-2 flex items-center gap-2">
                <Clock3
                  size={18}
                />
                Select Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 bg-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
              />
            </div>

            <button
              onClick={
                handleSchedule
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-2xl font-semibold shadow-md"
            >
              Book Scheduled Session
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
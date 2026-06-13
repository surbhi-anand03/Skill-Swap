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
    <div
      className="
        fixed inset-0 z-50
        bg-black/50
        backdrop-blur-sm
        overflow-y-auto
        px-3 sm:px-5
        py-4
      "
    >
      <div
        className="
          min-h-screen
          flex
          items-start
          sm:items-center
          justify-center
          py-4 sm:py-8
        "
      >
        {/* MODAL */}
        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-[28px]
            shadow-2xl
            overflow-visible
            my-4
          "
        >
          {/* HEADER */}
          <div
            className="
              bg-violet-600
              px-5 sm:px-6
              py-5
              text-white
              flex
              items-start
              justify-between
              gap-4
              rounded-t-[28px]
            "
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Book Session
              </h2>

              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                Start instantly or
                schedule for later
              </p>
            </div>

            <button
              onClick={close}
              className="
                shrink-0
                w-10 h-10
                rounded-full
                bg-white/20
                hover:bg-white/30
                flex
                items-center
                justify-center
                transition
              "
            >
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="p-4 sm:p-6">

            {/* ⚡ INSTANT SESSION */}
            <div
              className="
                bg-gradient-to-r
                from-green-50
                to-emerald-50
                border border-green-200
                rounded-3xl
                p-4 sm:p-5
                mb-5
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-green-100
                    flex
                    items-center
                    justify-center
                    text-green-600
                    shrink-0
                  "
                >
                  <Zap size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">
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
                className="
                  w-full
                  bg-green-500
                  hover:bg-green-600
                  transition
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  shadow-md
                "
              >
                Start Instant Session
              </button>
            </div>

            {/* 📅 SCHEDULE SESSION */}
            <div
              className="
                bg-violet-100
                border border-violet-200
                rounded-3xl
                p-4 sm:p-5
              "
            >
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Schedule Session
              </h3>

              {/* DATE */}
              <div className="mb-4">
                <label
                  className="
                    text-sm
                    font-medium
                    text-black
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
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
                  className="
                    w-full
                    border border-gray-200
                    bg-white
                    rounded-2xl
                    px-4 py-3
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                    text-gray-700
                    text-base
                  "
                />
              </div>

              {/* TIME */}
              <div className="mb-5">
                <label
                  className="
                    text-sm
                    font-medium
                    text-black
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
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
                  className="
                    w-full
                    border border-gray-200
                    bg-white
                    rounded-2xl
                    px-4 py-3
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                    text-gray-700
                    text-base
                  "
                />
              </div>

              <button
                onClick={
                  handleSchedule
                }
                className="
                  w-full
                  bg-violet-600
                  hover:bg-violet-700
                  transition
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  shadow-md
                "
              >
                Book Scheduled Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
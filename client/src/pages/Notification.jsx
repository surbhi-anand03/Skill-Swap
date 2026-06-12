import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationRead,
}
from "../api/api";

import {
  FaCheckCircle,
  FaBellSlash,
} from "react-icons/fa";

import NotificationCard
from "../components/NotificationCard";

import NotificationFilters
from "../components/NotificationFilters";

export default function Notification() {

  const [notifications, setNotifications] =
    useState([]);

  const [selected, setSelected] =
    useState("All");

  // ================= LOAD NOTIFICATIONS =================

  useEffect(() => {

    loadNotifications();

  }, []);

  const loadNotifications = async () => {

    try {

      const data =
        await getNotifications();

      setNotifications(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  // ================= OPEN NOTIFICATION =================

  const handleOpenNotification =
    async (notification) => {

      try {

        await markNotificationRead(
          notification._id
        );

        // remove immediately from UI

        setNotifications((prev) =>
          prev.filter(
            (item) =>
              item._id !== notification._id
          )
        );

      }

      catch (err) {

        console.log(err);

      }

    };

  // ================= FILTER =================

  const filteredNotifications =
    notifications.filter((n) => {

      if (selected === "All")
        return true;

      if (selected === "Requests")
        return (
          n.type === "request" ||
          n.type === "accepted"
        );

      if (selected === "Sessions")
        return (
          n.type === "session" ||
          n.type === "sessionAccepted" ||
          n.type === "sessionRejected"
        );

      if (selected === "Chats")
        return (
          n.type === "chat"
        );

      return true;

    });

  return (

    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1
          className="
          text-3xl
          sm:text-4xl
          font-bold
          "
        >
          Notifications
        </h1>

        <p className="text-slate-500 mt-2">
          Stay updated with your recent activity.
        </p>

      </div>

      {/* FILTERS */}

      <NotificationFilters
        selected={selected}
        setSelected={setSelected}
      />

      {/* NOTIFICATIONS */}

      <div className="space-y-4">

        {filteredNotifications.length === 0 ? (

  <div
    className="
    relative
    overflow-hidden
    rounded-[32px]
    border
    border-violet-100
    bg-gradient-to-br
    from-white
    via-violet-50/40
    to-violet-100/30
    p-8
    sm:p-12
    text-center
    shadow-sm
    "
  >

    {/* Background Glow */}
    <div
      className="
      absolute
      -top-16
      -right-16
      h-52
      w-52
      rounded-full
      bg-violet-200/30
      blur-3xl
      "
    />

    <div
      className="
      absolute
      -bottom-16
      -left-16
      h-52
      w-52
      rounded-full
      bg-fuchsia-200/20
      blur-3xl
      "
    />

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center">

      {/* Main Icon */}
      <div
        className="
        relative
        flex
        h-24
        w-24
        items-center
        justify-center
        rounded-full
        bg-gray-400
        shadow-xl
        shadow-violet-300/40
        mb-6
        "
      >
        <FaBellSlash className="text-white text-4xl" />

        {/* Small success badge */}
        <div
          className="
          absolute
          -bottom-1
          -right-1
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-green-500
          border-4
          border-white
          "
        >
          <FaCheckCircle className="text-white text-sm" />
        </div>
      </div>

      {/* Heading */}
      <h2
        className="
        text-2xl
        sm:text-3xl
        font-bold
        text-slate-800
        "
      >
        You're All Caught Up
      </h2>

      {/* Description */}
      <p
        className="
        text-slate-500
        mt-3
        max-w-md
        text-sm
        sm:text-base
        leading-relaxed
        "
      >
        No new notifications available right now.
        Your requests, chats, and sessions
        are fully updated.
      </p>

      {/* Status Badge */}
      <div
        className="
        mt-6
        flex
        items-center
        gap-2
        rounded-full
        bg-violet-100
        px-5
        py-2.5
        text-sm
        font-semibold
        text-violet-700
        "
      >
        <FaCheckCircle />
        Inbox Clean
      </div>

    </div>

  </div>

) : (

          filteredNotifications.map(
            (notification) => (

              <NotificationCard
                key={notification._id}
                notification={notification}
                onOpen={
                  handleOpenNotification
                }
              />

            )
          )

        )}

      </div>

    </div>

  );

}
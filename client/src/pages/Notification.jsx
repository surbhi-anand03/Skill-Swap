// import { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { getNotifications, markNotificationRead }
// from "../api/api";

// import NotificationCard
// from "../components/NotificationCard";

// import NotificationFilters
// from "../components/NotificationFilters";

// export default function Notification() {

//   const [notifications, setNotifications] =
//     useState([]);

//   const [selected, setSelected] =
//     useState("All");

//   useEffect(() => {

//     loadNotifications();

//   }, []);

//   const loadNotifications = async () => {

//     try {

//       const data =
//         await getNotifications();

//       setNotifications(data);

//     }
//     catch (err) {

//       console.log(err);

//     }

//   };

//   const filteredNotifications =
//     notifications.filter((n) => {

//       if (selected === "All")
//         return true;

//       if (selected === "Requests")
//         return (
//           n.type === "request" ||
//           n.type === "accepted"
//         );

//       if (selected === "Sessions")
//         return (
//           n.type === "session" ||
//           n.type === "sessionAccepted" ||
//           n.type === "sessionRejected"
//         );

//         if (selected === "Chats")
//             return n.type === "chat";

//       return true;

//     });

//   return (

//     <div className="max-w-5xl mx-auto p-6">

//       <div className="flex justify-between mb-8">

//         <div>

//           <h1
//             className="
//             text-4xl
//             font-bold
//             "
//           >
//             Notifications
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Stay updated with your recent activity.
//           </p>

//         </div>

//       </div>

//       <NotificationFilters
//         selected={selected}
//         setSelected={setSelected}
//       />

//       <div className="space-y-4">

//         {
//           filteredNotifications.map(
//             (notification) => (

//               <NotificationCard
//                 key={notification._id}
//                 notification={notification}
//               />

//             )
//           )
//         }

//       </div>

//     </div>

//   );

// }

import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationRead,
}
from "../api/api";

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
            bg-white
            rounded-3xl
            border
            border-slate-200
            p-10
            text-center
            "
          >

            <h2 className="text-xl font-bold text-slate-700">
              No Notifications
            </h2>

            <p className="text-slate-500 mt-2">
              You're all caught up 🎉
            </p>

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
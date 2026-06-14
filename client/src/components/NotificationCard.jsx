// import { Link } from "react-router-dom";

// import {
//   FaExchangeAlt,
//   FaCalendarAlt,
//   FaComments,
// } from "react-icons/fa";

// export default function NotificationCard({
//   notification,
// }) {

//   const isRequest =
//     notification.type === "request" ||
//     notification.type === "accepted";

//   const isChat =
//     notification.type === "chat";

//   const isSession =
//     notification.type === "session" ||
//     notification.type === "sessionAccepted" ||
//     notification.type === "sessionRejected";

//   // ================= ICON =================

//   let icon;

//   if (isRequest) {

//     icon = (
//       <FaExchangeAlt
//         className="text-blue-700 text-xl"
//       />
//     );

//   }

//   else if (isChat) {

//     icon = (
//       <FaComments
//         className="text-green-700 text-xl"
//       />
//     );

//   }

//   else {

//     icon = (
//       <FaCalendarAlt
//         className="text-violet-700 text-xl"
//       />
//     );

//   }

//   // ================= CARD COLOR =================

//   const bgColor =
//     isRequest
//       ? "bg-blue-50"
//       : isChat
//       ? "bg-green-50"
//       : "bg-violet-50";

//   // ================= REDIRECT LINK =================

//   let viewLink = "/notifications";

//   if (isRequest) {

//     viewLink = "/requests";

//   }

//   else if (isSession) {

//     viewLink = "/sessions";

//   }

//   else if (isChat) {

//     viewLink =
//       `/chat/${notification.sender?._id}`;

//   }

//   return (

//     <Link
//       to={viewLink}
//       className={`
//       block
//       ${bgColor}
//       rounded-3xl
//       border
//       border-slate-200
//       shadow-sm
//       p-4
//       sm:p-5
//       hover:shadow-lg
//       hover:scale-[1.01]
//       transition-all
//       duration-200
//       cursor-pointer
//       `}
//     >

//       <div
//         className="
//         flex
//         flex-col
//         min-[375px]:flex-row
//         gap-4
//         "
//       >

//         {/* ICON */}

//         <div
//           className="
//           w-14
//           h-14
//           rounded-full
//           bg-white
//           flex
//           items-center
//           justify-center
//           flex-shrink-0
//           shadow-sm
//           "
//         >
//           {icon}
//         </div>

//         {/* TEXT */}

//         <div className="flex-1 min-w-0">

//           <h2
//             className="
//             font-bold
//             text-base
//             sm:text-lg
//             text-slate-800
//             truncate
//             "
//           >
//             {notification.sender?.name}
//           </h2>

//           <p
//             className="
//             text-slate-500
//             mt-1
//             text-sm
//             break-words
//             "
//           >
//             {notification.message}
//           </p>

//         </div>

//       </div>

//     </Link>

//   );

// }

import { Link } from "react-router-dom";

import {
  FaExchangeAlt,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";

export default function NotificationCard({
  notification,
  onOpen,
}) {

  const isRequest =
    notification.type === "request" ||
    notification.type === "accepted";

  const isChat =
    notification.type === "chat";

  const isSession =
    notification.type === "session" ||
    notification.type === "sessionAccepted" ||
    notification.type === "sessionRejected";

  // ================= ICON =================

  let icon;

  if (isRequest) {

    icon = (
      <FaExchangeAlt
        className="text-blue-700 text-xl"
      />
    );

  }

  else if (isChat) {

    icon = (
      <FaComments
        className="text-green-700 text-xl"
      />
    );

  }

  else {

    icon = (
      <FaCalendarAlt
        className="text-violet-700 text-xl"
      />
    );

  }

  // ================= CARD BG =================

  const bgColor =
    isRequest
      ? "bg-blue-50"
      : isChat
      ? "bg-green-50"
      : "bg-violet-50";

  // ================= REDIRECT LINK =================

  let viewLink = "/notifications";

  if (isRequest) {

    viewLink = "/requests";

  }

  else if (isSession) {

    viewLink = "/sessions";

  }

  else if (isChat) {

    viewLink =
      `/chat/${notification.sender?._id}`;

  }

  return (

    <Link
      to={viewLink}
      onClick={() =>
        onOpen(notification)
      }
      className={`
        block
        ${bgColor}
        rounded-3xl
        border
        border-slate-200
        shadow-sm
        p-4
        sm:p-5
        transition-all
        duration-200
        hover:shadow-lg
        hover:scale-[1.01]
        cursor-pointer
      `}
    >

      <div
        className="
        flex
        flex-col
        min-[375px]:flex-row
        gap-4
        items-start
        "
      >

        {/* ICON */}

        <div
          className="
          w-14
          h-14
          rounded-full
          bg-white
          shadow-sm
          flex
          items-center
          justify-center
          flex-shrink-0
          "
        >
          {icon}
        </div>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <h2
            className="
            text-base
            sm:text-lg
            font-bold
            text-slate-800
            break-words
            "
          >
            {notification.sender?.name}
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            break-words
            leading-relaxed
            "
          >
            {notification.message}
          </p>

        </div>

      </div>

    </Link>

  );

}
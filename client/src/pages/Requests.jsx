// import { useEffect, useState } from "react";
// import {
//   getAllRequests,
//   respondRequest,
//   sendRequest,
// } from "../api/api";

// import {
//   Inbox,
//   Send,
//   Lightbulb,
//   BellRing,
//   ArrowRight,
// } from "lucide-react";

// export default function Requests() {
//   const [incoming, setIncoming] =
//     useState([]);

//   const [sent, setSent] =
//     useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res =
//         await getAllRequests();

//       setIncoming(
//         res.data.incoming || []
//       );

//       setSent(
//         res.data.pendingSent || []
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAction = async (
//     id,
//     action
//   ) => {
//     try {
//       await respondRequest(
//         id,
//         action
//       );

//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleResend = async (
//     userId
//   ) => {
//     try {
//       await sendRequest(userId);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderSkillSwap = (
//     offered = [],
//     wanted = []
//   ) => {
//     return (
//       <div className="flex flex-wrap items-center gap-2 mt-3">
//         {(offered || []).map(
//           (skill, index) => (
//             <span
//               key={`offer-${index}`}
//               className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
//             >
//               {skill}
//             </span>
//           )
//         )}

//         {(offered.length > 0 ||
//           wanted.length > 0) && (
//           <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100">
//             <ArrowRight
//               size={18}
//               className="text-slate-600"
//             />
//           </div>
//         )}

//         {(wanted || []).map(
//           (skill, index) => (
//             <span
//               key={`want-${index}`}
//               className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
//             >
//               {skill}
//             </span>
//           )
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-10 flex items-center gap-5">

//           <div >
//             <BellRing
//               className="text-violet-500"
//               size={40}
//             />
//           </div>

//           <div>
//             <h1 className="text-4xl font-bold text-slate-900">
//               Requests
//             </h1>

//             <p className="text-slate-500 text-lg mt-1">
//               Manage your incoming and
//               sent requests.
//             </p>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">

//           {/* INCOMING */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-7">

//             <div className="flex items-center justify-between mb-8">

//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
//                   <Inbox className="text-yellow-600" />
//                 </div>

//                 <h2 className="text-2xl font-bold">
//                   Incoming
//                 </h2>
//               </div>

//               <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
//                 {incoming.length}
//               </span>
//             </div>

//             {incoming.length === 0 ? (
//               <div className="border border-slate-200 rounded-[28px] py-20 flex flex-col items-center text-center">

//                 <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-5">
//                   <Inbox className="text-violet-600" />
//                 </div>

//                 <h3 className="font-semibold text-xl">
//                   No incoming requests
//                 </h3>

//                 <p className="text-slate-500 mt-2">
//                   You're all caught up!
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 {incoming.map((req) => (
//                   <div
//                     key={req._id}
//                     className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
//                   >
//                     <div className="flex gap-4">

//                       {/* <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-lg font-bold text-violet-700">
//                         {req.sender?.name?.charAt(
//                           0
//                         )}
//                       </div> */}

//                       <div
//                         className="
//                           w-14
//                           h-14
//                           rounded-full
//                           overflow-hidden
//                           bg-violet-100
//                           flex
//                           items-center
//                           justify-center
//                           text-lg
//                           font-bold
//                           text-violet-700
//                         "
//                       >
//                         {req.sender
//                           ?.profileImage ? (
//                           <img
//                             src={
//                               req.sender
//                                 .profileImage
//                             }
//                             alt="profile"
//                             className="
//                               w-full
//                               h-full
//                               object-cover
//                             "
//                           />
//                         ) : (
//                           req.sender?.name?.charAt(
//                             0
//                           )
//                         )}
//                       </div>

//                       <div className="flex-1">
//                         <h3 className="font-bold text-lg text-slate-900">
//                           {
//                             req.sender?.name
//                           }
//                         </h3>

//                         {renderSkillSwap(
//                           req.sender
//                             ?.skillsOffered ||
//                             req.sender
//                               ?.skills ||
//                             [],
//                           req.sender
//                             ?.skillsWanted ||
//                             []
//                         )}

//                         {/* ACTIONS */}
//                         <div className="flex gap-3 mt-4 flex-wrap">

//                           <button
//                             onClick={() =>
//                               handleAction(req._id, "accepted")
//                             }
//                             className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                           >
//                             ✓ Accept
//                           </button>

//                           <button
//                             onClick={() =>
//                               handleAction(req._id, "ignored")
//                             }
//                             className="flex items-center gap-2 border border-red-500 hover:bg-red-400 text-red-500 hover:text-black px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                           >
//                             ✕ Ignore
//                           </button>

//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* SENT */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-7">

//             <div className="flex items-center justify-between mb-8">

//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
//                   <Send className="text-pink-600" />
//                 </div>

//                 <h2 className="text-2xl font-bold">
//                   Sent
//                 </h2>
//               </div>

//               <span className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
//                 {sent.length}
//               </span>
//             </div>

//             {sent.length === 0 ? (
//               <div className="border border-slate-200 rounded-[28px] py-20 flex flex-col items-center text-center">

//                 <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-5">
//                   <Send className="text-violet-600" />
//                 </div>

//                 <h3 className="font-semibold text-xl">
//                   No sent requests
//                 </h3>

//                 <p className="text-slate-500 mt-2">
//                   You haven't sent any
//                   requests yet.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 {sent.map((req) => (
//                   <div
//                     key={req._id}
//                     className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
//                   >
//                     <div className="flex gap-4">

//                       {/* <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-lg font-bold text-pink-700">
//                         {req.receiver?.name?.charAt(
//                           0
//                         )}
//                       </div> */}

//                         <div
//                           className="
//                             w-14
//                             h-14
//                             rounded-full
//                             overflow-hidden
//                             bg-red-100
//                             flex
//                             items-center
//                             justify-center
//                             text-lg
//                             font-bold
//                             text-pink-700
//                           "
//                         >
//                           {req.receiver?.profileImage ? (
//                             <img
//                               src={req.receiver.profileImage}
//                               alt="profile"
//                               className="
//                                 w-full
//                                 h-full
//                                 object-cover
//                               "
//                             />
//                           ) : (
//                             req.receiver?.name?.charAt(0)
//                           )}
//                         </div>

//                       <div className="flex-1">
//                         <h3 className="font-bold text-lg text-slate-900">
//                           {
//                             req.receiver
//                               ?.name
//                           }
//                         </h3>

//                         {renderSkillSwap(
//                           req.receiver
//                             ?.skillsOffered ||
//                             req.receiver
//                               ?.skills ||
//                             [],
//                           req.receiver
//                             ?.skillsWanted ||
//                             []
//                         )}

//                         {/* ACTIONS */}
//                         <div className="flex gap-3 mt-4 flex-wrap">

//                           <button
//                             onClick={() =>
//                               handleResend(req.receiver?._id)
//                             }
//                             className="flex items-center gap-2 bg-violet-500 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                           >
//                             ↻ Resend
//                           </button>

//                           <button
//                             onClick={() =>
//                               handleAction(req._id, "skipped")
//                             }
//                             className="flex items-center gap-2 border border-slate-500 hover:bg-slate-300 text-black px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                           >
//                             ✕ Skip
//                           </button>

//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* TIP */}
//             <div className="mt-8 bg-indigo-50 rounded-3xl p-5 flex gap-3 items-start">
//               <Lightbulb className="text-indigo-500 mt-1" />

//               <p className="text-slate-600 text-sm">
//                 <span className="font-semibold">
//                   Tip:
//                 </span>{" "}
//                 Be clear about what you want
//                 to learn and what you can
//                 teach.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import {
//   getAllRequests,
//   respondRequest,
// } from "../api/api";

// export default function Requests() {
//   const [incoming, setIncoming] =
//     useState([]);

//   const [sent, setSent] =
//     useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res =
//         await getAllRequests();

//       setIncoming(
//         res.data.incoming || []
//       );

//       setSent(
//         res.data.pendingSent || []
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAction = async (
//     id,
//     action
//   ) => {
//     try {
//       await respondRequest(
//         id,
//         action
//       );

//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-8">
//           <h1 className="text-5xl font-bold text-slate-900">
//             Requests
//             <span className="text-violet-600 ml-2">
//               ✨
//             </span>
//           </h1>

//           <p className="text-slate-500 mt-2 text-lg">
//             Manage your incoming and
//             outgoing requests
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">

//           {/* RECEIVED REQUESTS */}
//           <div className="bg-white rounded-[28px] border border-slate-200 overflow-hidden">
//             <div className="px-7 py-6 border-b border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-900">
//                 Received Requests
//                 <span className="text-violet-600">
//                   {" "}
//                   ({incoming.length})
//                 </span>
//               </h2>
//             </div>

//             {incoming.length === 0 ? (
//               <div className="p-10 text-center text-slate-500">
//                 No received requests
//               </div>
//             ) : (
//               incoming.map((req, index) => (
//                 <div
//                   key={req._id}
//                   className={`grid grid-cols-[1.7fr_1fr_1fr_auto] gap-6 p-6 items-center ${
//                     index !==
//                     incoming.length -
//                       1
//                       ? "border-b border-slate-200"
//                       : ""
//                   }`}
//                 >
//                   {/* USER INFO */}
//                   <div className="flex items-start gap-4">
//                     <div className="w-16 h-16 rounded-full overflow-hidden bg-violet-100 shrink-0">
//                       {req.sender
//                         ?.profileImage ? (
//                         <img
//                           src={
//                             req.sender
//                               .profileImage
//                           }
//                           alt="profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-violet-500 text-white flex items-center justify-center font-bold text-lg">
//                           {req.sender?.name?.charAt(
//                             0
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <h3 className="font-bold text-xl text-slate-900">
//                         {
//                           req.sender
//                             ?.name
//                         }
//                       </h3>

//                       <p className="text-slate-600 text-sm leading-6 mt-1">
//                         {req.sender
//                           ?.bio ||
//                           "SkillSwap Member"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* THEY WANT */}
//                   <div>
//                     <p className="text-sm font-semibold text-slate-500 mb-3">
//                       They want
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {(
//                         req.sender
//                           ?.skillsWanted ||
//                         []
//                       )
//                         .slice(0, 2)
//                         .map(
//                           (
//                             skill,
//                             i
//                           ) => (
//                             <span
//                               key={i}
//                               className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm font-medium"
//                             >
//                               {skill}
//                             </span>
//                           )
//                         )}
//                     </div>
//                   </div>

//                   {/* THEY OFFER */}
//                   <div>
//                     <p className="text-sm font-semibold text-slate-500 mb-3">
//                       They offer
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {(
//                         req.sender
//                           ?.skillsOffered ||
//                         req.sender
//                           ?.skills ||
//                         []
//                       )
//                         .slice(0, 2)
//                         .map(
//                           (
//                             skill,
//                             i
//                           ) => (
//                             <span
//                               key={i}
//                               className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm font-medium"
//                             >
//                               {skill}
//                             </span>
//                           )
//                         )}
//                     </div>
//                   </div>

//                   {/* ACTIONS */}
//                   <div className="flex flex-col gap-3">
//                     <button
//                       onClick={() =>
//                         handleAction(
//                           req._id,
//                           "accepted"
//                         )
//                       }
//                       className="bg-violet-600 hover:bg-violet-700 text-white px-7 py-3 rounded-xl font-semibold transition"
//                     >
//                       Accept
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleAction(
//                           req._id,
//                           "ignored"
//                         )
//                       }
//                       className="border border-violet-500 text-violet-600 hover:bg-violet-50 px-7 py-3 rounded-xl font-semibold transition"
//                     >
//                       Decline
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* SENT REQUESTS */}
//           <div className="bg-white rounded-[28px] border border-slate-200 overflow-hidden">
//             <div className="px-7 py-6 border-b border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-900">
//                 Sent Requests
//                 <span className="text-violet-600">
//                   {" "}
//                   ({sent.length})
//                 </span>
//               </h2>
//             </div>

//             {sent.length === 0 ? (
//               <div className="p-10 text-center text-slate-500">
//                 No sent requests
//               </div>
//             ) : (
//               sent.map((req, index) => (
//                 <div
//                   key={req._id}
//                   className={`grid grid-cols-[1.7fr_1fr_1fr_auto] gap-6 p-6 items-center ${
//                     index !==
//                     sent.length - 1
//                       ? "border-b border-slate-200"
//                       : ""
//                   }`}
//                 >
//                   {/* USER INFO */}
//                   <div className="flex items-start gap-4">
//                     <div className="w-16 h-16 rounded-full overflow-hidden bg-violet-100 shrink-0">
//                       {req.receiver
//                         ?.profileImage ? (
//                         <img
//                           src={
//                             req.receiver
//                               .profileImage
//                           }
//                           alt="profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-violet-500 text-white flex items-center justify-center font-bold text-lg">
//                           {req.receiver?.name?.charAt(
//                             0
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <h3 className="font-bold text-xl text-slate-900">
//                         {
//                           req.receiver
//                             ?.name
//                         }
//                       </h3>

//                       <p className="text-slate-600 text-sm leading-6 mt-1">
//                         {req.receiver
//                           ?.bio ||
//                           "SkillSwap Member"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* THEY WANT */}
//                   <div>
//                     <p className="text-sm font-semibold text-slate-500 mb-3">
//                       They want
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {(
//                         req.receiver
//                           ?.skillsWanted ||
//                         []
//                       )
//                         .slice(0, 2)
//                         .map(
//                           (
//                             skill,
//                             i
//                           ) => (
//                             <span
//                               key={i}
//                               className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm font-medium"
//                             >
//                               {skill}
//                             </span>
//                           )
//                         )}
//                     </div>
//                   </div>

//                   {/* THEY OFFER */}
//                   <div>
//                     <p className="text-sm font-semibold text-slate-500 mb-3">
//                       They offer
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {(
//                         req.receiver
//                           ?.skillsOffered ||
//                         req.receiver
//                           ?.skills ||
//                         []
//                       )
//                         .slice(0, 2)
//                         .map(
//                           (
//                             skill,
//                             i
//                           ) => (
//                             <span
//                               key={i}
//                               className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm font-medium"
//                             >
//                               {skill}
//                             </span>
//                           )
//                         )}
//                     </div>
//                   </div>

//                   {/* SKIP BUTTON */}
//                   <button
//                     onClick={() =>
//                       handleAction(
//                         req._id,
//                         "skipped"
//                       )
//                     }
//                     className="border border-slate-400 text-slate-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition"
//                   >
//                     Skip
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  getAllRequests,
  respondRequest,
} from "../api/api";

export default function Requests() {
  const [incoming, setIncoming] =
    useState([]);

  const [sent, setSent] =
    useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res =
        await getAllRequests();

      setIncoming(
        res.data.incoming || []
      );

      setSent(
        res.data.pendingSent || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (
    id,
    action
  ) => {
    try {
      await respondRequest(
        id,
        action
      );

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">
            Requests
            <span className="text-violet-600 ml-2">
              ✨
            </span>
          </h1>

          <p className="text-slate-500 text-base mt-1">
            Manage your incoming and
            outgoing requests
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">

          {/* RECEIVED */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Received Requests
                <span className="text-violet-600 ml-2">
                  ({incoming.length})
                </span>
              </h2>
            </div>

            {incoming.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No received requests
              </div>
            ) : (
              incoming.map((req, index) => (
                <div
                  key={req._id}
                  // className={`grid lg:grid-cols-[1.8fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center ${
                  className={`group
                    grid lg:grid-cols-[1.8fr_1fr_1fr_auto]
                    gap-4 px-5 py-5 items-center
                    hover:bg-violet-50
                    hover:scale-[1.01]
                    transition-all duration-300
                  `}
                >
                  {index !== incoming.length - 1 && (
                    <hr className="border-slate-200 mx-5" />
                  )}
                  {/* USER INFO */}
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0">
                      {req.sender
                        ?.profileImage ? (
                        <img
                          src={
                            req.sender
                              .profileImage
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-violet-500 text-white flex items-center justify-center font-bold">
                          {req.sender?.name?.charAt(
                            0
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[17px] text-slate-900">
                        {
                          req.sender
                            ?.name
                        }
                      </h3>

                      <p className="text-[13px] text-violet-700 leading-5 mt-1 line-clamp-2">
                        {req.sender
                          ?.bio ||
                          "SkillSwap Member"}
                      </p>
                    </div>
                  </div>

                  {/* SKILLS WANTED */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Wants
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.sender
                          ?.skillsWanted ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-violet-100 text-violet-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* SKILLS OFFERED */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Offers
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.sender
                          ?.skillsOffered ||
                        req.sender
                          ?.skills ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "accepted"
                        )
                      }
                      className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          req._id,
                          "ignored"
                        )
                      }
                      className="border border-violet-300 text-violet-600 hover:bg-violet-100 px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SENT */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Sent Requests
                <span className="text-blue-600 ml-2">
                  ({sent.length})
                </span>
              </h2>
            </div>

            {sent.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No sent requests
              </div>
            ) : (
              sent.map((req, index) => (
                <div
                  key={req._id}
                  // className={`grid lg:grid-cols-[1.8fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center ${
                  className={`group
                    grid lg:grid-cols-[1.8fr_1fr_1fr_auto]
                    gap-4 px-5 py-5 items-center
                    hover:bg-blue-50
                    hover:scale-[1.01]
                    transition-all duration-300
                    `}
                  >
                    {index !== incoming.length - 1 && (
                      <hr className="border-slate-200 mx-5" />
                    )}
                  {/* USER INFO */}
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0">
                      {req.receiver
                        ?.profileImage ? (
                        <img
                          src={
                            req.receiver
                              .profileImage
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {req.receiver?.name?.charAt(
                            0
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[17px] text-slate-900">
                        {
                          req.receiver
                            ?.name
                        }
                      </h3>

                      <p className="text-[13px] text-blue-700 leading-5 mt-1 line-clamp-2">
                        {req.receiver
                          ?.bio ||
                          "SkillSwap Member"}
                      </p>
                    </div>
                  </div>

                  {/* WANTS */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Wants
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.receiver
                          ?.skillsWanted ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* OFFERS */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Offers
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(
                        req.receiver
                          ?.skillsOffered ||
                        req.receiver
                          ?.skills ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            skill,
                            i
                          ) => (
                            <span
                              key={i}
                              className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                    </div>
                  </div>

                  {/* SKIP */}
                  <button
                    onClick={() =>
                      handleAction(
                        req._id,
                        "ignored"
                      )
                    }
                    className="border border-blue-300 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Skip
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
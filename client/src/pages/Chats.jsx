
import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { io } from "socket.io-client";

import {
  getConversations,
} from "../api/api";

// SOCKET
const socket = io(
  "http://localhost:5000"
);

export default function Chats() {
  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([]);

  const [
    unread,
    setUnread,
  ] = useState({});

  const currentUser =
    localStorage.getItem(
      "userId"
    );

  const [
    search,
    setSearch,
  ] = useState("");

  // ================= LOAD =================

  const loadConversations =
    async () => {
      try {
        const res =
          await getConversations();

        setConversations(
          res.data
        );

        console.log(
          "CONVERSATIONS:",
          res.data
        );
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    loadConversations();

    // join socket
    socket.emit(
      "join",
      currentUser
    );

    socket.on(
      "getOnlineUsers",
      (users) => {
        setOnlineUsers(
          users
        );
      }
    );

    // unread update
    socket.on(
      "unreadUpdate",
      (data) => {
        setUnread(data);
        loadConversations();
      }
    );

    return () => {
      socket.off(
        "getOnlineUsers"
      );

      socket.off(
        "unreadUpdate"
      );
    };
  }, []);

  // ================= SEARCH FILTER =================

  const filteredChats =
    conversations.filter(
      (chat) =>
        chat.user?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    // <div className="fixed inset-0 flex bg-white overflow-hidden">
    // <div className="w-full h-[100vh] flex bg-white overflow-hidden">
      <div
        className="
          w-full
          h-[calc(100vh-64px)]
          md:h-[100vh]
          flex
          bg-white
          overflow-hidden
        "
      >  
    {/* ================= CHAT LIST ================= */}

      {/* <div className="w-full lg:w-[360px] h-full bg-white border-r flex flex-col overflow-hidden"> */}
      {/* <div className="w-full md:w-[360px] lg:w-[380px] h-full bg-white border-r flex flex-col shrink-0"> */}
        <div
          className="
            w-full
            lg:w-[340px]
            xl:w-[360px]
            lg:min-w-[340px]
            xl:min-w-[360px]
            h-full
            min-h-0
            bg-white
            border-r
            flex
            flex-col
            flex-shrink-0
            overflow-hidden
          "
        >
        {/* TOP */}
        <div className="px-4 pt-5 pb-3 border-b flex-shrink-0">

          <div className="px-4 py-3 border-b">
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full px-4 py-2 bg-gray-100 rounded-xl outline-none"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Chats
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Connect with learners
          </p>
        </div>
                {/* ================= CONVERSATIONS ================= */}

<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
          {filteredChats.length ===
          0 ? (
            <div className="flex items-center justify-center h-full text-center px-6">

              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  No conversations
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Start chatting with
                  people to see your
                  conversations here.
                </p>
              </div>

            </div>
          ) : (
            filteredChats.map(
              (chat) => {

                const userId =
                  chat.user?._id;

                const isUserOnline =
                  onlineUsers.some(
                    (u) =>
                      String(
                        u.userId
                      ) ===
                      String(
                        userId
                      )
                  );

                const unreadCount =
                  unread[
                    currentUser
                  ]?.[
                    userId
                  ] || 0;

                return (
                  <Link
                    key={userId}
                    to={`/chat/${userId}`}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition mb-2 hover:bg-indigo-50 active:scale-[0.98]">

                      {/* PROFILE IMAGE */}

                      <div className="relative flex-shrink-0">

                        <img
                          src={
                            chat.user
                              ?.profileImage ||
                            `https://ui-avatars.com/api/?name=${chat.user?.name}&background=6366f1&color=fff`
                          }
                          alt={
                            chat.user
                              ?.name
                          }
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        {/* ONLINE DOT */}

                        <span
                          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                            isUserOnline
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* USER INFO */}

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between items-start gap-2">

  <h3 className="font-semibold text-gray-800 truncate text-[15px] flex-1 min-w-0">
    {chat.user?.name}
  </h3>

  <div className="flex flex-col items-end shrink-0">

    <span className="text-[11px] text-gray-400 whitespace-nowrap">
      {chat.updatedAt
        ? new Date(
            chat.updatedAt
          ).toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",
              minute:
                "2-digit",
            }
          )
        : ""}
    </span>

    {unreadCount > 0 && (
      <span className="mt-1 bg-red-500 text-white text-[10px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
        {unreadCount}
      </span>
    )}
  </div>

</div>

                        <p className="text-sm text-gray-500 truncate mt-1">
                          {chat.lastMessage ||
                            "Start conversation"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )
          )}
        </div>

      </div>
            {/* ================= RIGHT SIDE ================= */}

      {/* <div className="hidden lg:flex flex-1 items-center justify-center bg-[#f8fafc]"> */}
<div className="hidden lg:flex flex-1 min-w-0 items-center justify-center bg-[#f8fafc] h-full">        <div className="text-center px-6">

          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            SkillSwap Chat
          </h2>

          <p className="text-gray-500 mt-3 text-lg max-w-md">
            Select a conversation
            to start chatting and
            connect with learners.
          </p>

        </div>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";

import { io } from "socket.io-client";

import { getConversations } from "../api/api";

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

  const [search, setSearch] =
    useState("");

  const currentUser =
    localStorage.getItem(
      "userId"
    );

  // ================= LOAD CONVERSATIONS =================
  const loadConversations =
    async () => {
      try {
        const res =
          await getConversations();

        setConversations(
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

    return () => {
      socket.off(
        "getOnlineUsers"
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
    <div className="h-screen bg-[#f4f5f7] flex overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <div className="w-full md:w-[340px] bg-white border-r flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-600">
            SkillSwap
          </h2>

          <button className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition">
            <FaEllipsisV />
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search conversations"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filteredChats.length ===
          0 ? (
            <div className="text-center text-gray-500 mt-10">
              No conversations yet
            </div>
          ) : (
            filteredChats.map(
              (chat) => {
                const userId =
                  chat.user._id;

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

                return (
                  <Link
                    key={userId}
                    to={`/chat/${userId}`}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition mb-2 hover:bg-indigo-50">
                      {/* AVATAR */}
                      <div className="relative">
                        <img
 src={
  chat.user?.profileImage ||
  `https://ui-avatars.com/api/?name=${chat.user.name}&background=6366f1&color=fff`
}
  alt={chat.user.name}
  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
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
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold truncate text-gray-800">
                            {
                              chat
                                .user
                                .name
                            }
                          </h3>

                          <span className="text-xs text-gray-400">
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
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            SkillSwap Chat
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Select a conversation
            to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}


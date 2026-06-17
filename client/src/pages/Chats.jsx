import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { getConversations } from "../api/api";
import {
  FaSearch,
  FaComments,
} from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function Chats() {
  const [conversations, setConversations] =
    useState([]);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [unread, setUnread] =
    useState({});

  const [search, setSearch] =
    useState("");

  const currentUser =
    localStorage.getItem("userId");

  // ================= LOAD CONVERSATIONS =================

  const loadConversations =
    async () => {
      try {
        const res =
          await getConversations();

        setConversations(
          res.data || []
        );
      } catch (err) {
        console.log(err);
      }
    };

  // ================= SOCKET =================

  useEffect(() => {
    loadConversations();

    socket.emit(
      "join",
      currentUser
    );

    socket.on(
      "getOnlineUsers",
      (users) => {
        setOnlineUsers(users);
      }
    );

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
    conversations.filter((chat) =>
      chat.user?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div
  className="
    flex
    h-[calc(100vh-64px)]
    mt-16
    lg:mt-0
    lg:ml-[280px]
    lg:w-[calc(100%-280px)]
    bg-gray-50
    overflow-hidden
  "
>
      {/* LEFT SIDE */}
      <div
  className="
    w-full
    md:w-[320px]
    lg:w-[340px]
    xl:w-[370px]
    md:min-w-[320px]
    lg:min-w-[340px]
    xl:min-w-[370px]
    bg-white
    border-r
    flex
    flex-col
    shrink-0
  "
>
        {/* HEADER */}
        <div className="px-5 pt-5 pb-4 border-b bg-white">
          <h1 className="text-2xl font-bold text-violet-700">
            Chats
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Connect with learners
          </p>

          {/* SEARCH */}
          <div className="relative mt-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-2xl
                bg-gray-100
                outline-none
                border
                border-transparent
                focus:border-violet-500
                transition
              "
            />
          </div>
        </div>

        {/* CONVERSATION LIST */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredChats.length ===
          0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <FaComments className="text-3xl text-violet-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No conversations
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Start chatting with
                people to see your
                conversations here.
              </p>
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
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-2xl
                        hover:bg-violet-50
                        transition
                        cursor-pointer
                        active:scale-[0.98]
                        mb-2
                      "
                    >
                      {/* PROFILE */}
                      <div className="relative shrink-0">
                        <img
                          src={
                            chat.user
                              ?.profileImage ||
                            `https://ui-avatars.com/api/?name=${chat.user?.name}&background=7c3aed&color=fff`
                          }
                          alt={
                            chat.user
                              ?.name
                          }
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        {/* ONLINE DOT */}
                        <span
                          className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            isUserOnline
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* USER INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {
                              chat.user
                                ?.name
                            }
                          </h3>

                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-[11px] text-gray-400">
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

                            {unreadCount >
                              0 && (
                              <span className="mt-1 bg-red-500 text-white text-[11px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                                {
                                  unreadCount
                                }
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

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 bg-[#f8fafc] items-center justify-center p-10">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <FaComments className="text-4xl text-violet-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            SkillSwap Chat
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Select a conversation
            to start chatting and
            connect with learners.
          </p>
        </div>
      </div>
    </div>
  );
}
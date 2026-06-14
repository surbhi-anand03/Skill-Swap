
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  FaPaperPlane,
  FaSearch,
  FaEllipsisV,
  FaCircle,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

import { io } from "socket.io-client";

import {
  sendMessage,
  getMessages,
  getConversations,
} from "../api/api";

// SOCKET
const socket = io(
  "http://localhost:5000"
);

export default function Chat() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const currentUser =
    localStorage.getItem(
      "userId"
    );

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([]);

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [unread, setUnread] =
    useState({});

  const [isTyping, setIsTyping] =
    useState(false);

  const [lastSeen, setLastSeen] =
    useState({});

  const selectedChatId =
    id;

  const typingTimeout =
    useRef(null);

  const bottomRef =
    useRef(null);

  // selected user
  const selectedChat =
    conversations.find(
      (chat) =>
        String(
          chat.user?._id
        ) ===
        String(
          selectedChatId
        )
    );

  const selectedUser =
    selectedChat?.user;

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

  // ================= INITIAL LOAD =================

  useEffect(() => {
    loadConversations();

    socket.emit(
      "join",
      currentUser
    );
  }, []);

  // ================= FETCH CHAT =================

  useEffect(() => {
    if (
      selectedChatId
    ) {
      fetchMessages();

      socket.emit(
        "markAsRead",
        {
          userId:
            currentUser,
          chatUserId:
            selectedChatId,
        }
      );
    }
  }, [selectedChatId]);

  // ================= AUTO SCROLL =================

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [messages]);

  // ================= MESSAGE SEEN =================

  useEffect(() => {
    messages.forEach(
      (msg) => {
        if (
          msg.sender ===
            selectedChatId &&
          !msg.seen
        ) {
          socket.emit(
            "messageSeen",
            {
              messageId:
                msg._id,
              sender:
                msg.sender,
            }
          );
        }
      }
    );
  }, [messages]);

  // ================= SOCKET LISTENERS =================

  useEffect(() => {
    const handleMessage = (
      data
    ) => {
      if (
        (data.sender ===
          currentUser &&
          data.receiver ===
            selectedChatId) ||
        (data.sender ===
          selectedChatId &&
          data.receiver ===
            currentUser)
      ) {
        setMessages(
          (prev) => [
            ...prev,
            data,
          ]
        );
      }
    };

    socket.on(
      "receiveMessage",
      handleMessage
    );

    socket.on(
      "getOnlineUsers",
      (users) => {
        setOnlineUsers(
          users
        );
      }
    );

    socket.on(
      "unreadUpdate",
      (data) => {
        setUnread(
          data
        );

        loadConversations();
      }
    );

    socket.on(
      "typing",
      () => {
        setIsTyping(
          true
        );
      }
    );

    socket.on(
      "stopTyping",
      () => {
        setIsTyping(
          false
        );
      }
    );

    socket.on(
      "lastSeenUpdate",
      (data) => {
        setLastSeen(
          data
        );
      }
    );

    socket.on(
      "messageSeen",
      ({
        messageId,
      }) => {
        setMessages(
          (prev) =>
            prev.map(
              (msg) =>
                msg._id ===
                messageId
                  ? {
                      ...msg,
                      seen:
                        true,
                    }
                  : msg
            )
        );
      }
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleMessage
      );

      socket.off(
        "getOnlineUsers"
      );

      socket.off(
        "unreadUpdate"
      );

      socket.off(
        "typing"
      );

      socket.off(
        "stopTyping"
      );

      socket.off(
        "messageSeen"
      );

      socket.off(
        "lastSeenUpdate"
      );
    };
  }, [
    currentUser,
    selectedChatId,
  ]);

  // ================= FETCH MESSAGES =================

  const fetchMessages =
    async () => {
      try {
        const res =
          await getMessages(
            currentUser,
            selectedChatId
          );

        const sortedMessages =
          res.data.sort(
            (a, b) =>
              new Date(
                a.createdAt
              ) -
              new Date(
                b.createdAt
              )
          );

        setMessages(
          sortedMessages
        );
      } catch (err) {
        console.log(err);
      }
    };
  // ================= SEND MESSAGE =================

  const handleSend =
    async () => {
      if (
        !message.trim()
      )
        return;

      try {
        const newMsg = {
          sender:
            currentUser,
          receiver:
            selectedChatId,
          text: message,
        };

        // SAVE IN DB
        const res =
          await sendMessage(
            newMsg
          );

        // UPDATE UI
        setMessages(
          (prev) => [
            ...prev,
            res.data,
          ]
        );

        // SOCKET SEND
        socket.emit(
          "sendMessage",
          res.data
        );

        setMessage("");

        socket.emit(
          "stopTyping",
          {
            sender:
              currentUser,
            receiver:
              selectedChatId,
          }
        );

        setIsTyping(
          false
        );

        loadConversations();
      } catch (err) {
        console.log(err);
      }
    };

  // ================= ENTER =================

  const handleKeyPress =
    (e) => {
      if (
        e.key ===
        "Enter"
      ) {
        handleSend();
      }
    };

  // ================= HELPERS =================

  const isOnline =
    onlineUsers.some(
      (user) =>
        String(
          user.userId
        ) ===
        String(
          selectedChatId
        )
    );

  const formatDateLabel =
    (date) => {
      const msgDate =
        new Date(date);

      const today =
        new Date();

      const yesterday =
        new Date();

      yesterday.setDate(
        today.getDate() -
          1
      );

      if (
        msgDate.toDateString() ===
        today.toDateString()
      ) {
        return "Today";
      }

      if (
        msgDate.toDateString() ===
        yesterday.toDateString()
      ) {
        return "Yesterday";
      }

      return msgDate.toLocaleDateString(
        [],
        {
          day: "numeric",
          month:
            "long",
          year:
            "numeric",
        }
      );
    };

  return (
    <div
  className="
    w-full
    h-screen
    flex
    bg-white
    overflow-hidden
  "
>
      {/* ================= SIDEBAR ================= */}

      <div
        className={`
          ${
            selectedChatId
              ? "hidden lg:flex"
              : "flex"
          }
          w-full
          lg:w-[340px]
          xl:w-[360px]
          lg:min-w-[340px]
          xl:min-w-[360px]
          h-full
          bg-white
          border-r
          flex-col
          flex-shrink-0
          overflow-hidden
        `}
      >
        {/* TOP */}

        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-violet-600">
            Chats
          </h2>

          <button className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition">
            <FaEllipsisV />
          </button>
        </div>

        {/* SEARCH */}

        <div className="p-4 border-b">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-3 rounded-2xl">
            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* CONVERSATIONS */}

        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
          {conversations.length ===
          0 ? (
            <div className="flex justify-center items-center h-full text-slate-500">
              No conversations yet
            </div>
          ) : (
            conversations.map(
              (chat) => {
                const userId =
                  chat.user
                    ?._id;

                const unreadCount =
                  unread?.[
                    currentUser
                  ]?.[
                    userId
                  ] || 0;

                const isActiveChat =
                  String(
                    id
                  ) ===
                  String(
                    userId
                  );

                const isUserOnline =
                  onlineUsers.some(
                    (
                      u
                    ) =>
                      String(
                        u.userId
                      ) ===
                      String(
                        userId
                      )
                  );

                return (
                  <Link
                    key={
                      userId
                    }
                    to={`/chat/${userId}`}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition mb-2 hover:bg-violet-50 ${
                        isActiveChat
                          ? "bg-violet-100"
                          : ""
                      }`}
                    >
                      {/* AVATAR */}

                      <div className="relative shrink-0">
                        <img
                          src={
                            chat
                              .user
                              ?.profileImage ||
                            `https://ui-avatars.com/api/?name=${chat.user?.name}&background=6366f1&color=fff`
                          }
                          alt="profile"
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        <span
                          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                            isUserOnline
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <h3 className="font-semibold truncate text-slate-800">
                            {
                              chat
                                .user
                                ?.name
                            }
                          </h3>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-slate-400">
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
                              0 &&
                              !isActiveChat && (
                                <span className="bg-red-500 text-white text-[10px] min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 font-semibold">
                                  {
                                    unreadCount
                                  }
                                </span>
                              )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 truncate mt-1">
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

      {/* ================= CHAT AREA ================= */}

      {!selectedChatId ? (
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              SkillSwap Chat
            </h2>

            <p className="text-slate-500 mt-3">
              Select a conversation
              to start chatting
            </p>
          </div>
        </div>
      ) : (
       <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* ================= HEADER ================= */}

          <div
            className="
              bg-white
              px-3 sm:px-5 lg:px-6
              py-3 sm:py-4
              border-b
              flex
              items-center
              justify-between
              gap-3
              shadow-sm
              shrink-0
            "
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* BACK BUTTON MOBILE */}

              <button
                onClick={() =>
                  navigate("/chats")
                }
                className="
                  lg:hidden
                  w-10 h-10
                  rounded-xl
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  text-slate-700
                "
              >
                ←
              </button>

              {/* PROFILE */}

              <img
                src={
                  selectedUser?.profileImage ||
                  `https://ui-avatars.com/api/?name=${
                    selectedUser?.name ||
                    "User"
                  }&background=6366f1&color=fff`
                }
                alt={
                  selectedUser?.name
                }
                className="
                  w-12 h-12
                  sm:w-14 sm:h-14
                  rounded-full
                  object-cover
                  shrink-0
                "
              />

              {/* USER INFO */}

              <div className="min-w-0">
                <h2 className="font-bold text-base sm:text-lg lg:text-xl truncate text-slate-800">
                  {selectedUser?.name ||
                    "Loading..."}
                </h2>

                <div className="flex items-center gap-2 mt-1">
                  <FaCircle
                    className={`text-[10px] ${
                      isOnline
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />

                  <span className="text-xs sm:text-sm text-slate-500 truncate">
                    {isTyping ? (
                      "Typing..."
                    ) : isOnline ? (
                      "Online"
                    ) : lastSeen[
                        selectedChatId
                      ] ? (
                      `Last seen ${new Date(
                        lastSeen[
                          selectedChatId
                        ]
                      ).toLocaleString()}`
                    ) : (
                      "Offline"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* MENU */}

            <button className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200 transition shrink-0">
              <FaEllipsisV />
            </button>
          </div>

          {/* ================= MESSAGES ================= */}

          <div
  className="
    flex-1
    overflow-y-auto
    px-3
    sm:px-5
    lg:px-6
    py-4
    space-y-4
    bg-slate-100
    min-h-0
  "
>
            {messages.map(
              (
                msg,
                index
              ) => {
                const currentDate =
                  new Date(
                    msg.createdAt
                  ).toDateString();

                const previousDate =
                  index > 0
                    ? new Date(
                        messages[
                          index - 1
                        ].createdAt
                      ).toDateString()
                    : null;

                const showDate =
                  currentDate !==
                  previousDate;

                return (
                  <div
                    key={
                      msg._id ||
                      `${msg.createdAt}-${index}`
                    }
                  >
                    {/* DATE */}

                    {showDate && (
                      <div className="flex justify-center my-5">
                        <span className="bg-white px-4 py-1 rounded-full text-xs text-slate-500 shadow-sm">
                          {formatDateLabel(
                            msg.createdAt
                          )}
                        </span>
                      </div>
                    )}

                    {/* MESSAGE */}

                    <div
                      className={`flex ${
                        msg.sender ===
                        currentUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] px-4 sm:px-5 py-3 rounded-[24px] shadow-sm ${
                          msg.sender ===
                          currentUser
                            ? "bg-violet-600 text-white rounded-br-md"
                            : "bg-white text-slate-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm sm:text-[15px] break-words whitespace-pre-wrap">
                          {
                            msg.text
                          }
                        </p>

                        {/* TIME + SEEN */}

                        <div
                          className={`flex items-center gap-1 justify-end text-[11px] mt-2 ${
                            msg.sender ===
                            currentUser
                              ? "text-violet-100"
                              : "text-slate-400"
                          }`}
                        >
                          <span>
                            {msg.createdAt
                              ? new Date(
                                  msg.createdAt
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

                          {msg.sender ===
                            currentUser &&
                            (msg.seen ? (
                              <FaCheckDouble className="text-blue-300" />
                            ) : (
                              <FaCheck />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            <div
              ref={bottomRef}
            />
          </div>

          {/* ================= INPUT ================= */}

          <div
            className="
              bg-white
              p-3 sm:p-4 lg:p-5
              border-t
              shrink-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-2 sm:gap-3
                bg-slate-100
                rounded-2xl
                px-3 sm:px-5
                py-2 sm:py-3
              "
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={
                  message
                }
                onChange={(
                  e
                ) => {
                  setMessage(
                    e.target
                      .value
                  );

                  socket.emit(
                    "typing",
                    {
                      sender:
                        currentUser,
                      receiver:
                        selectedChatId,
                    }
                  );

                  clearTimeout(
                    typingTimeout.current
                  );

                  typingTimeout.current =
                    setTimeout(
                      () => {
                        socket.emit(
                          "stopTyping",
                          {
                            sender:
                              currentUser,
                            receiver:
                              selectedChatId,
                          }
                        );
                      },
                      1000
                    );
                }}
                onKeyDown={
                  handleKeyPress
                }
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-sm
                  sm:text-base
                "
              />

              <button
                onClick={
                  handleSend
                }
                className="
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  p-3 sm:p-4
                  rounded-full
                  transition
                  shrink-0
                "
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

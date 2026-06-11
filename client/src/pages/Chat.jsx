
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  FaPaperPlane,
  FaCircle,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

import { io } from "socket.io-client";

import {
  sendMessage,
  getMessages,
  getConversations,
} from "../api/api";

// ================= SOCKET =================

const socket = io(
  "http://localhost:5000"
);

export default function Chat() {
  const { id } = useParams();
  const navigate =
    useNavigate();

  const currentUser =
    localStorage.getItem(
      "userId"
    );

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
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

  const bottomRef =
    useRef(null);

  const selectedChatId =
    id;

  // ================= SELECTED CHAT =================

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

  // ================= FETCH MESSAGES =================

  const fetchMessages =
    async () => {
      try {
        const res =
          await getMessages(
            currentUser,
            selectedChatId
          );

        const sorted =
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
          sorted
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

  // ================= CHAT CHANGE =================

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
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

  // ================= SOCKET =================

  useEffect(() => {
    const handleMessage =
      (data) => {
        if (
          (String(
            data.sender
          ) ===
            String(
              currentUser
            ) &&
            String(
              data.receiver
            ) ===
              String(
                selectedChatId
              )) ||
          (String(
            data.sender
          ) ===
            String(
              selectedChatId
            ) &&
            String(
              data.receiver
            ) ===
              String(
                currentUser
              ))
        ) {
          setMessages(
            (prev) => [
              ...prev,
              data,
            ]
          );
        }
      };

    const handleOnlineUsers =
      (users) => {
        setOnlineUsers(
          users
        );
      };

    socket.on(
      "receiveMessage",
      handleMessage
    );

    socket.on(
      "getOnlineUsers",
      handleOnlineUsers
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleMessage
      );

      socket.off(
        "getOnlineUsers",
        handleOnlineUsers
      );
    };
  }, [
    currentUser,
    selectedChatId,
  ]);

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

        const res =
          await sendMessage(
            newMsg
          );

        setMessages(
          (prev) => [
            ...prev,
            res.data,
          ]
        );

        socket.emit(
          "sendMessage",
          res.data
        );

        setMessage("");

        loadConversations();
      } catch (err) {
        console.log(err);
      }
    };

  // ================= ENTER KEY =================

  const handleKeyPress =
    (e) => {
      if (
        e.key ===
        "Enter"
      ) {
        handleSend();
      }
    };

  // ================= ONLINE =================

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

  // ================= SEARCH =================

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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">

      {/* ================= SIDEBAR ================= */}

      <div
        className={`${
          selectedChatId
            ? "hidden lg:flex"
            : "flex"
        }
        w-full md:w-[340px] lg:w-[360px]
        bg-white border-r
        flex-col h-screen flex-shrink-0`}
      >

        {/* HEADER */}

        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">

          <h2 className="text-2xl font-bold text-violet-600">
            SkillSwap
          </h2>

          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            💬
          </div>
        </div>

        {/* SEARCH */}

        <div className="p-4 border-b flex-shrink-0">

          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">

            <FaSearch className="text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target
                    .value
                )
              }
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* CHAT LIST */}

        <div className="flex-1 overflow-y-auto p-3">
          {filteredChats.length ===
          0 ? (
            <div className="text-center text-gray-500 mt-10">
              No conversations
              yet
            </div>
          ) : (
            filteredChats.map(
              (chat) => {
                const userId =
                  chat.user
                    ?._id;

                const userOnline =
                  onlineUsers.some(
                    (u) =>
                      String(
                        u.userId
                      ) ===
                      String(
                        userId
                      )
                  );

                const isActive =
                  String(
                    id
                  ) ===
                  String(
                    userId
                  );

                return (
                  <Link
                    key={
                      userId
                    }
                    to={`/chat/${userId}`}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer mb-2 ${
                        isActive
                          ? "bg-violet-100 border border-violet-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                                          {/* USER IMAGE */}

                      <div className="relative flex-shrink-0">

                        <img
                          src={
                            chat.user
                              ?.profileImage ||
                            `https://ui-avatars.com/api/?name=${chat.user?.name}&background=7c3aed&color=fff`
                          }
                          alt="user"
                          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover"
                          onError={(
                            e
                          ) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${chat.user?.name}&background=7c3aed&color=fff`;
                          }}
                        />

                        {/* ONLINE STATUS */}

                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            userOnline
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* USER INFO */}

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between items-center gap-2">

                          <h3 className="font-semibold text-sm lg:text-base truncate text-gray-800">
                            {
                              chat
                                .user
                                ?.name
                            }
                          </h3>

                          <span className="text-[11px] text-gray-400 flex-shrink-0">
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

      {/* ================= CHAT AREA ================= */}

      {!selectedChatId ? (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#f8fafc]">

          <div className="text-center px-6">

            <div className="w-28 h-28 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-14 h-14 bg-violet-600 rounded-full" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              SkillSwap Chat
            </h2>

            <p className="text-gray-500 mt-3 text-lg max-w-md">
              Select a conversation
              to start chatting and
              connect with learners
              around the world.
            </p>
          </div>
        </div>
      ) : (

          <div className="flex-1 flex flex-col h-screen min-h-0 overflow-hidden bg-[#f5f5f7]">

  {/* ================= HEADER ================= */}

  <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center shadow-sm flex-shrink-0">

    {/* MOBILE BACK BUTTON */}
    <button
      onClick={() => navigate("/chats")}
      className="lg:hidden mr-3 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
    >
      <FaArrowLeft />
    </button>

    {/* USER IMAGE */}
    <img
      src={
        selectedUser?.profileImage ||
        `https://ui-avatars.com/api/?name=${
          selectedUser?.name || "User"
        }&background=7c3aed&color=fff`
      }
      alt={selectedUser?.name}
      className="w-11 h-11 lg:w-14 lg:h-14 rounded-full object-cover flex-shrink-0"
    />

    {/* USER DETAILS */}
    <div className="ml-3 min-w-0">
      <h2 className="font-bold text-sm lg:text-lg truncate text-gray-800">
        {selectedUser?.name || "Loading..."}
      </h2>

      <div className="flex items-center gap-2 mt-1">
        <FaCircle
          className={`text-[9px] ${
            isOnline
              ? "text-green-500"
              : "text-gray-400"
          }`}
        />

        <span className="text-xs text-gray-500">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  </div>

  {/* ================= MESSAGES ================= */}

  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-0">

    {messages.map((msg, index) => (
      <div
        key={msg._id || index}
        className={`flex ${
          String(msg.sender) === String(currentUser)
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] sm:max-w-[75%] lg:max-w-[65%]
          px-4 py-3 rounded-[26px]
          shadow-sm break-words ${
            String(msg.sender) ===
            String(currentUser)
              ? "bg-violet-600 text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {msg.text}
          </p>

          <p
            className={`text-[11px] mt-2 ${
              String(msg.sender) ===
              String(currentUser)
                ? "text-violet-100"
                : "text-gray-400"
            }`}
          >
            {msg.createdAt
              ? new Date(
                  msg.createdAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>
      </div>
    ))}

    <div ref={bottomRef} />
  </div>

  {/* ================= INPUT ================= */}

  <div className="bg-white border-t p-3 flex-shrink-0">

    <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyPress}
        className="flex-1 bg-transparent outline-none text-sm min-w-0"
      />

      <button
        onClick={handleSend}
        className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shrink-0 transition"
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
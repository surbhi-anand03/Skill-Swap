import { useParams } from "react-router-dom";
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
} from "react-icons/fa";

import { io } from "socket.io-client";

import {
  sendMessage,
  getMessages,
} from "../api/api";

// SOCKET
const socket = io("http://localhost:5000");

export default function Chat() {

  const { id } = useParams();

  const currentUser = localStorage.getItem("userId");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const bottomRef = useRef(null);

  // ================= LOAD =================
  useEffect(() => {

    fetchMessages();

    // JOIN USER
    socket.emit("join", currentUser);

  }, [id]);

  // ================= AUTO SCROLL =================
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // ================= SOCKET LISTENERS =================
  useEffect(() => {

    const handleMessage = (data) => {

      // ONLY ADD MESSAGE IF IT BELONGS TO CURRENT CHAT
      if (
        (data.sender === currentUser &&
          data.receiver === id) ||
        (data.sender === id &&
          data.receiver === currentUser)
      ) {

        setMessages((prev) => [...prev, data]);

      }

    };

const handleOnlineUsers = (users) => {

  console.log("ONLINE USERS:", users);

  console.log("CHAT USER ID:", id);

  setOnlineUsers(users);

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

  }, [currentUser, id]);

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {

    try {

      const res = await getMessages(
        currentUser,
        id
      );

      // SORT BY TIME
      const sortedMessages =
        res.data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );

      setMessages(sortedMessages);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= SEND MESSAGE =================
  const handleSend = async () => {

    if (!message.trim()) return;

    try {

      const newMsg = {
        sender: currentUser,
        receiver: id,
        text: message,
      };
// SAVE IN DB
const res = await sendMessage(newMsg);

// INSTANTLY UPDATE SENDER UI
setMessages((prev) => [
  ...prev,
  res.data,
]);

// SEND TO RECEIVER
socket.emit(
  "sendMessage",
  res.data
);

setMessage("");
    } catch (err) {

      console.log(err);

    }

  };

  // ================= ENTER KEY =================
  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      handleSend();

    }

  };

  // ================= ONLINE STATUS =================
const isOnline = onlineUsers.some(
  (user) =>
    String(user.userId) === String(id)
);

  return (

    <div className="h-screen bg-gray-100 flex overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <div className="w-[350px] bg-white border-r hidden md:flex flex-col">

        {/* TOP */}
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

          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search conversations"
              className="bg-transparent outline-none w-full"
            />

          </div>

        </div>

        {/* CHAT PREVIEW */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition">

            <img
              src="https://i.pravatar.cc/100"
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">

              <div className="flex justify-between items-center">

                <h3 className="font-semibold">
                  Current Chat
                </h3>

                <span className="text-xs text-gray-500">
                  Active
                </span>

              </div>

              <p className="text-sm text-gray-500 truncate">
                Open conversation
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b flex items-center justify-between shadow-sm">

          <div className="flex items-center gap-4">

            <img
              src="https://i.pravatar.cc/150"
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />

            <div>

              <h2 className="font-bold text-xl">
                User Chat
              </h2>

              <div className="flex items-center gap-2 mt-1">

                <FaCircle
                  className={`text-xs ${
                    isOnline
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />

                <span className="text-sm text-gray-500">

                  {isOnline
                    ? "Online"
                    : "Offline"}

                </span>

              </div>

            </div>

          </div>

          <button className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition">

            <FaEllipsisV />

          </button>

        </div>

        {/* ================= MESSAGES ================= */}

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-100">

          {messages.map((msg, index) => (

            <div
              key={msg._id || index}
              className={`flex ${
                msg.sender === currentUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[70%] px-5 py-3 rounded-3xl shadow-sm ${
                  msg.sender === currentUser
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white text-black rounded-bl-md"
                }`}
              >

                <p className="text-[15px] break-words">
                  {msg.text}
                </p>

                <p
                  className={`text-xs mt-2 ${
                    msg.sender === currentUser
                      ? "text-indigo-100"
                      : "text-gray-400"
                  }`}
                >

                  {msg.createdAt
                    ? new Date(
                        msg.createdAt
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}

                </p>

              </div>

            </div>

          ))}

          <div ref={bottomRef}></div>

        </div>

        {/* ================= INPUT ================= */}

        <div className="bg-white p-5 border-t">

          <div className="flex items-center gap-4 bg-gray-100 rounded-2xl px-5 py-3">

            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent outline-none text-lg"
            />

            <button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full transition"
            >

              <FaPaperPlane />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
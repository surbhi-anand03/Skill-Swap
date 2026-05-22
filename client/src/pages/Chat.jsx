import { useParams } from "react-router-dom";
import {
  useEffect,
  useState,
  useRef,
} from "react";

import { FaPaperPlane } from "react-icons/fa";

import { io } from "socket.io-client";

import {
  sendMessage,
  getMessages,
} from "../api/api";


// SOCKET CONNECTION
const socket = io("http://localhost:5000");


export default function Chat() {

  const { id } = useParams();

  // LOGGED IN USER
  const currentUser = localStorage.getItem("userId");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const bottomRef = useRef(null);


  // ================= LOAD OLD MESSAGES =================
  useEffect(() => {

    fetchMessages();

    // JOIN SOCKET
    socket.emit("join", currentUser);

  }, []);


  // ================= AUTO SCROLL =================
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // ================= SOCKET LISTENERS =================
  useEffect(() => {

    // RECEIVE MESSAGE
    socket.on("receiveMessage", (data) => {

      setMessages((prev) => [
        ...prev,
        data,
      ]);

    });


    // GET ONLINE USERS
    socket.on("getOnlineUsers", (users) => {

      setOnlineUsers(users);

    });


    return () => {

      socket.off("receiveMessage");
      socket.off("getOnlineUsers");

    };

  }, []);


  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {

    try {

      const res = await getMessages(
        currentUser,
        id
      );

      setMessages(res.data);

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

      // SAVE TO DATABASE
      const res = await sendMessage(newMsg);

      // UPDATE MY UI
      setMessages((prev) => [
        ...prev,
        res.data,
      ]);

      // SEND REALTIME
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
  const isOnline = onlineUsers.includes(id);


  return (

    <div className="flex justify-center items-center p-6">

      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">


        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Chat
            </h2>

            <p className="text-sm opacity-90">
              {isOnline ? "Online" : "Offline"}
            </p>

          </div>


          {/* ONLINE DOT */}
          <div
            className={`w-4 h-4 rounded-full ${
              isOnline
                ? "bg-green-400"
                : "bg-gray-400"
            }`}
          ></div>

        </div>


        {/* MESSAGES */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === currentUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.sender === currentUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>

            </div>

          ))}

          {/* AUTO SCROLL */}
          <div ref={bottomRef}></div>

        </div>


        {/* INPUT */}
        <div className="flex items-center gap-3 p-4 border-t">

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyPress}
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
          />


          <button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition"
          >
            <FaPaperPlane />
          </button>

        </div>

      </div>

    </div>
  );
}
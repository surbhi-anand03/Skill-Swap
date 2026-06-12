import { useParams, Link } from "react-router-dom";
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
const socket = io("http://localhost:5000");

export default function Chat() {

  const { id } = useParams();


  

  const currentUser = localStorage.getItem("userId");

const [isTyping, setIsTyping] =
  useState(false);

const typingTimeout =
  useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
const selectedChatId = id;

const selectedChat = conversations.find(
  (chat) =>
    String(chat.user?._id) === String(selectedChatId)
);
const selectedUser = selectedChat?.user;

  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await getConversations();

      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOAD =================
useEffect(() => {
  loadConversations();
  socket.emit("join", currentUser);
}, []);




useEffect(() => {
  if (selectedChatId) {
    fetchMessages();
  }
}, [selectedChatId]);


useEffect(() => {
  messages.forEach((msg) => {

    if (
      msg.sender ===
      selectedChatId &&
      !msg.seen
    ) {

      socket.emit(
        "messageSeen",
        {
          messageId: msg._id,
          sender: msg.sender,
        }
      );
    }
  });
}, [messages]);




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
          data.receiver === selectedChatId) ||
        (data.sender === selectedChatId &&
          data.receiver === currentUser)
      ) {

        setMessages((prev) => [...prev, data]);

      }

    };

socket.on("typing", () => {
  setIsTyping(true);
});

socket.on("stopTyping", () => {
  setIsTyping(false);
});

socket.on("messageSeen", ({ messageId }) => {
  setMessages((prev) =>
    prev.map((msg) =>
      msg._id === messageId
        ? { ...msg, seen: true }
        : msg
    )
  );
});
    

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

      socket.off("typing");
socket.off("stopTyping");
socket.off("messageSeen");

    };

  }, [currentUser, selectedChatId]);

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {

    try {

      const res = await getMessages(
        currentUser,
        selectedChatId
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
        receiver: selectedChatId,
        text: message,
      };
// SAVE IN DB
const res = await sendMessage(newMsg);

// INSTANTLY UPDATE SENDER UI
setMessages((prev) => [...prev, res.data]);

loadConversations();

// SEND TO RECEIVER
socket.emit(
  "sendMessage",
  res.data
);

setMessage("");

socket.emit("stopTyping", {
  sender: currentUser,
  receiver: selectedChatId,
});

setIsTyping(false);

loadConversations();
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
    String(user.userId) === String(selectedChatId)
);

const formatDateLabel = (date) => {
  const msgDate = new Date(date);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (
    msgDate.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  return msgDate.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


  return (

    <div className="h-screen bg-gray-100 flex overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      
<div className="w-full md:w-[340px] bg-white border-r flex flex-col">
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

          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search conversations"
              className="bg-transparent outline-none w-full"
            />

          </div>

        </div>


<div className="flex-1 overflow-y-auto px-3 pb-3">

  {conversations.length === 0 ? (
    <div className="text-center text-gray-500 mt-10">
      No conversations yet
    </div>
  ) : (
    conversations.map((chat) => {

      const userId = chat.user?._id;

      const isUserOnline = onlineUsers.some(
        (u) => String(u.userId) === String(userId)
      );

      return (
        <Link key={userId} to={`/chat/${userId}`}>
          
         <div
  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition mb-2 hover:bg-gray-50 ${
  String(id) === String(userId)
  ? "bg-indigo-50"
  : ""
  }`}
>

            {/* 👇 YOUR CODE (WITH ONLINE DOT ADDED) */}
           <div className="relative">
              <img
               src={
  chat.user?.profileImage ||
  `https://ui-avatars.com/api/?name=${chat.user?.name}&background=6366f1&color=fff`
}
               className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                alt="avatar"
              />

              {/* online dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isUserOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            {/* 👇 TEXT PART (your code) */}
<div className="flex-1 min-w-0">

  <div className="flex justify-between items-center">

    <p className="font-semibold truncate">
      {chat.user?.name}
    </p>

    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
      {chat.updatedAt
        ? new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}
    </span>

  </div>

  <p className="text-sm text-gray-500 truncate">
    {chat.lastMessage}
  </p>

</div>

          </div>

        </Link>
      );
    })
  )}

</div>

      </div>

      {/* ================= CHAT AREA ================= */}

     {!selectedChatId ? (

  <div className="flex-1 flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-700">
        SkillSwap Chat
      </h2>

      <p className="text-gray-500 mt-2">
        Select a conversation to start chatting
      </p>
    </div>
  </div>

) : (

  <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b flex items-center justify-between shadow-sm">

          <div className="flex items-center gap-4">
<img
  src={
  selectedUser?.profileImage ||
  `https://ui-avatars.com/api/?name=${selectedUser?.name || "User"}&background=6366f1&color=fff`
}
  alt={selectedUser?.name}
  className="w-14 h-14 rounded-full object-cover"
  onError={(e) => {
  e.target.src = `https://ui-avatars.com/api/?name=${selectedUser?.name || "User"}&background=6366f1&color=fff`;
  }}
/>

            <div>
<h2 className="font-bold text-xl">
  {selectedUser?.name || "Loading..."}
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

                   {isTyping
   ? "Typing..."
   : isOnline
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

          {messages.map((msg, index) => {
          
         

          const currentDate = new Date(
            msg.createdAt
              ).toDateString();

              const previousDate =
             index > 0
      ? new Date(
          messages[index - 1].createdAt
        ).toDateString()
      : null;

const showDate =
  currentDate !== previousDate;

return (

<div key={msg._id || `${msg.createdAt}-${index}`}>
  
  {showDate && (
    <div className="flex justify-center my-4">
      <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-500 shadow">
        {formatDateLabel(msg.createdAt)}
      </span>
    </div>
  )}

  <div
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
<div className="flex items-center justify-end gap-1 mt-2">
  <span
    className={`text-xs ${
      msg.sender === currentUser
        ? "text-indigo-100"
        : "text-gray-400"
    }`}
  >
    {msg.createdAt
      ? new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""}
  </span>

  {msg.sender === currentUser && (
    msg.seen ? (
      <FaCheckDouble className="text-xs text-blue-300" />
    ) : (
      <FaCheck className="text-xs text-indigo-100" />
    )
  )}
</div>

              </div>

            </div>
</div>

);
})}
          <div ref={bottomRef}></div>

        </div>

        {/* ================= INPUT ================= */}

        <div className="bg-white p-5 border-t">

          <div className="flex items-center gap-4 bg-gray-100 rounded-2xl px-5 py-3">

            <input
              type="text"
              placeholder="Type a message..."
              value={message}
             onChange={(e) => {
  setMessage(e.target.value);

  socket.emit("typing", {
    sender: currentUser,
    receiver: selectedChatId,
  });

  clearTimeout(
    typingTimeout.current
  );

  typingTimeout.current =
    setTimeout(() => {
      socket.emit(
        "stopTyping",
        {
          sender: currentUser,
          receiver: selectedChatId,
        }
      );
    }, 1000);
}}
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

)}

    </div>
  );
}
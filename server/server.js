const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("./cron/sessionCron");

const connectDB = require("./config/db");
const Message = require("./models/Message");
const initializeSessionSocket = require("./sockets/sessionSocket");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");const requestRoutes = require("./routes/request");
const matchRoutes = require("./routes/match");
const sessionRoutes = require("./routes/session");
const chatRoutes = require("./routes/chat");

const notificationRoutes = require("./routes/notification");

connectDB();

const app = express();

app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);
app.use(cors());

// ================= ROUTES =================
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notification",notificationRoutes);

// ================= HOME =================
app.get("/", (req, res) => {
  res.send("API running...");
});

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ================= ONLINE USERS =================
let onlineUsers = [];

let lastSeen = {};

let unreadMessages = {};

// ADD USER
const addUser = (userId, socketId) => {
  const exists = onlineUsers.find(
    (user) => user.userId === userId
  );

  if (!exists) {
    onlineUsers.push({
      userId,
      socketId,
    });
  }
};

// REMOVE USER
const removeUser = (socketId) => {
  const user = onlineUsers.find(
    (u) => u.socketId === socketId
  );

  if (user) {
    lastSeen[user.userId] = new Date();

    console.log(
      "LAST SEEN SAVED:",
      user.userId,
      lastSeen[user.userId]
    );
  }

  onlineUsers = onlineUsers.filter(
    (u) => u.socketId !== socketId
  );
};

// GET USER
const getUser = (userId) => {
  return onlineUsers.find(
    (user) => user.userId === userId
  );
};

// ================= SOCKET CONNECTION =================

io.on("connection", (socket) => {

socket.on("join", (userId) => {
  addUser(userId, socket.id);

  console.log("USER JOINED:", userId);

  io.emit("getOnlineUsers", onlineUsers);

  socket.emit(
    "lastSeenUpdate",
    lastSeen
  );
});
  socket.on("sendMessage", (data) => {
    const user = getUser(
      data.receiver
    );

    if (user) {
      io.to(user.socketId).emit(
        "receiveMessage",
        data
      );
    }

  const receiverId = data.receiver;
const senderId = data.sender;

if (!unreadMessages[receiverId]) {
  unreadMessages[receiverId] = {};
}

if (!unreadMessages[receiverId][senderId]) {
  unreadMessages[receiverId][senderId] = 0;
}

unreadMessages[receiverId][senderId] += 1;

io.emit("unreadUpdate", unreadMessages);
  

  });

  socket.on("typing", ({ sender, receiver }) => {
    const receiverUser =
      getUser(receiver);

    if (receiverUser) {
      io.to(receiverUser.socketId)
        .emit("typing");
    }
  });

  socket.on("stopTyping", ({ sender, receiver }) => {
    const receiverUser =
      getUser(receiver);

    if (receiverUser) {
      io.to(receiverUser.socketId)
        .emit("stopTyping");
    }
  });

socket.on("markAsRead", ({ userId, chatUserId }) => {
  if (unreadMessages[userId]?.[chatUserId] !== undefined) {
    unreadMessages[userId][chatUserId] = 0;
  }

  io.emit("unreadUpdate", unreadMessages);

 
});

  socket.on(
    "messageSeen",
    async ({ messageId, sender }) => {

      await Message.findByIdAndUpdate(
        messageId,
        { seen: true }
      );

      const senderUser =
        getUser(sender);

      if (senderUser) {
        io.to(senderUser.socketId)
          .emit(
            "messageSeen",
            { messageId }
          );
      }
    }
  );
socket.on("disconnect", () => {
  const user = onlineUsers.find(
    (u) => u.socketId === socket.id
  );

  if (user) {
    lastSeen[user.userId] =
      new Date().toISOString();

    console.log(
      "LAST SEEN SAVED:",
      user.userId,
      lastSeen[user.userId]
    );
  }

  removeUser(socket.id);

  io.emit(
    "getOnlineUsers",
    onlineUsers
  );

  io.emit(
    "lastSeenUpdate",
    lastSeen
  );

  console.log(
    "LAST SEEN OBJECT:",
    lastSeen
  );
});
});// <-- closes io.on("connection")
// io.on("connection", (socket) => {
//   console.log(
//     "User connected:",
//     socket.id
//   );

//   // ================= JOIN =================
//   socket.on("join", (userId) => {
//     addUser(userId, socket.id);

//     console.log(
//       "Online Users:",
//       onlineUsers
//     );

//     // SEND ONLINE USERS TO EVERYONE
//     io.emit(
//       "getOnlineUsers",
//       onlineUsers
//     );
//   });

//   // ================= SEND MESSAGE =================
//   socket.on(
//     "sendMessage",
//     (data) => {
//       const user = getUser(
//         data.receiver
//       );

//       if (user) {
//         io.to(user.socketId).emit(
//           "receiveMessage",
//           data
//         );
//       }
//     }
//   );

//   // ================= DISCONNECT =================
//   socket.on("disconnect", () => {
//     console.log(
//       "User disconnected:",
//       socket.id
//     );

//     removeUser(socket.id);

//     // UPDATE ONLINE USERS
//     io.emit(
//       "getOnlineUsers",
//       onlineUsers
//     );
//   });
// });

// ================= SESSION SOCKET =================
initializeSessionSocket(io);

// ================= START SERVER =================
server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});
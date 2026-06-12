

const express = require("express");
const dotenv = require("dotenv");
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

dotenv.config();

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);

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
  onlineUsers = onlineUsers.filter(
    (user) => user.socketId !== socketId
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

    io.emit(
      "getOnlineUsers",
      onlineUsers
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
    removeUser(socket.id);

    io.emit(
      "getOnlineUsers",
      onlineUsers
    );

    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});
// ================= SESSION SOCKET =================
initializeSessionSocket(io);

// ================= START SERVER =================
server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});
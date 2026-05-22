const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const matchRoutes = require("./routes/match");
const sessionRoutes = require("./routes/session");
const chatRoutes = require("./routes/chat");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
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


// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// ================= USERS =================
const users = {};
let onlineUsers = [];


// ================= CONNECTION =================
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);


  // JOIN
  socket.on("join", (userId) => {

    users[userId] = socket.id;

    onlineUsers = onlineUsers.filter(
      (id) => id !== userId
    );

    onlineUsers.push(userId);

    io.emit("getOnlineUsers", onlineUsers);

    console.log("Online Users:", onlineUsers);
  });


  // SEND MESSAGE
  socket.on("sendMessage", (data) => {

    const receiverSocketId =
      users[data.receiver];

    if (receiverSocketId) {

      io.to(receiverSocketId).emit(
        "receiveMessage",
        data
      );
    }
  });


  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("Disconnected:", socket.id);

    for (const userId in users) {

      if (users[userId] === socket.id) {

        delete users[userId];

        onlineUsers = onlineUsers.filter(
          (id) => id !== userId
        );

        break;
      }
    }

    io.emit("getOnlineUsers", onlineUsers);

    console.log("Online Users:", onlineUsers);
  });

});


// ================= START =================
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
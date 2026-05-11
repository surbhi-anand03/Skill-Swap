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


// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// STORE CONNECTED USERS
const users = {};

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // USER JOINS
  socket.on("join", (userId) => {
    users[userId] = socket.id;

    console.log("Users:", users);
  });

  // SEND MESSAGE
  socket.on("sendMessage", (data) => {

    const receiverSocketId = users[data.receiver];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "receiveMessage",
        data
      );
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// ================= START SERVER =================
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
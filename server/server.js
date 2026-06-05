// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");

// const http = require("http");
// const { Server } = require("socket.io");

// require("./cron/sessionCron");

// const connectDB = require("./config/db");

// const initializeSessionSocket = require("./sockets/sessionSocket");
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
// const requestRoutes = require("./routes/request");
// const matchRoutes = require("./routes/match");
// const sessionRoutes = require("./routes/session");
// const chatRoutes = require("./routes/chat");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(express.json());
// app.use(cors());


// // ================= ROUTES =================
// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/request", requestRoutes);
// app.use("/api/match", matchRoutes);
// app.use("/api/session", sessionRoutes);
// app.use("/api/chat", chatRoutes);


// // ================= HOME =================
// app.get("/", (req, res) => {
//   res.send("API running...");
// });


// // ================= HTTP SERVER =================
// const server = http.createServer(app);


// // ================= SOCKET.IO =================
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// // ================= ONLINE USERS =================
// let onlineUsers = [];

// // ADD USER
// const addUser = (userId, socketId) => {

//   const exists = onlineUsers.find(
//     (user) => user.userId === userId
//   );

//   if (!exists) {

//     onlineUsers.push({
//       userId,
//       socketId,
//     });

//   }

// };

// // REMOVE USER
// const removeUser = (socketId) => {

//   onlineUsers = onlineUsers.filter(
//     (user) => user.socketId !== socketId
//   );

// };

// // GET USER
// const getUser = (userId) => {

//   return onlineUsers.find(
//     (user) => user.userId === userId
//   );

// };

// // ================= SOCKET CONNECTION =================
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
// //   socket.on("disconnect", () => {

// // <<<<<<< HEAD
// // initializeSessionSocket(io);
// // =======
// //     console.log(
// //       "User disconnected:",
// //       socket.id
// //     );

// //     removeUser(socket.id);

// //     // UPDATE ONLINE USERS
// //     io.emit(
// //       "getOnlineUsers",
// //       onlineUsers
// //     );

// //   });

// // });
// // >>>>>>> 27de763b3fa0279b90fb066dfe77d468c7366542

// // ================= START SERVER =================
// server.listen(5000, () => {

//   console.log(
//     "Server running on port 5000"
//   );

// });

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

require("./cron/sessionCron");

const connectDB = require("./config/db");

const initializeSessionSocket = require("./sockets/sessionSocket");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const matchRoutes = require("./routes/match");
const sessionRoutes = require("./routes/session");
const chatRoutes = require("./routes/chat");

dotenv.config();

console.log("APP ID:", process.env.AGORA_APP_ID);
console.log("CERT:", process.env.AGORA_APP_CERTIFICATE);
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
  console.log(
    "User connected:",
    socket.id
  );

  // ================= JOIN =================
  socket.on("join", (userId) => {
    addUser(userId, socket.id);

    console.log(
      "Online Users:",
      onlineUsers
    );

    // SEND ONLINE USERS TO EVERYONE
    io.emit(
      "getOnlineUsers",
      onlineUsers
    );
  });

  // ================= SEND MESSAGE =================
  socket.on(
    "sendMessage",
    (data) => {
      const user = getUser(
        data.receiver
      );

      if (user) {
        io.to(user.socketId).emit(
          "receiveMessage",
          data
        );
      }
    }
  );

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );

    removeUser(socket.id);

    // UPDATE ONLINE USERS
    io.emit(
      "getOnlineUsers",
      onlineUsers
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
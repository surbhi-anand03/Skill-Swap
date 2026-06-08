// const users = {};

// const initializeSocket = (io) => {

//   io.on("connection", (socket) => {

//     socket.on("join", (userId) => {

//       users[userId] = socket.id;

//     });

//     socket.on(
//       "session-request",
//       (data) => {

//         const receiverSocket =
//           users[data.receiver];

//         if (receiverSocket) {

//           io.to(receiverSocket).emit(
//             "new-session-request",
//             data
//           );
//         }
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log("Disconnected");
//     });
//   });
// };

// module.exports = initializeSocket;

const users = {};

const initializeSocket = (io) => {

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {

      users[userId] = socket.id;

    });

    socket.on(
      "session-request",
      (data) => {

        const receiverSocket =
          users[data.receiver];

        if (receiverSocket) {

          io.to(receiverSocket).emit(
            "new-session-request",
            data
          );

        }

      }
    );

    socket.on("disconnect", () => {

      for (const userId in users) {

        if (users[userId] === socket.id) {

          delete users[userId];

          break;

        }

      }

      console.log(
        "Socket disconnected:",
        socket.id
      );

    });

  });

};

module.exports = initializeSocket;
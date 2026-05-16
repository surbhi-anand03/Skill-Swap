// const mongoose = require("mongoose");

// const sessionSchema = new mongoose.Schema(
//   {
//     hostUser: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     participantUser: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     skill: {
//       type: String,
//       default: "",
//     },

//     sessionType: {
//       type: String,
//       enum: ["instant", "scheduled"],
//       // default: "scheduled",
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "accepted",
//         "upcoming",
//         "ongoing",
//         "completed",
//         "cancelled",
//         "missed",
//       ],
//       default: "pending",
//     },

//     startTime: Date,

//     endTime: Date,

//     meetingProvider: {
//       type: String,
//       enum: ["jitsi", "agora"],
//       default: "jitsi",
//     },

//     meetingRoomId: String,

//     token: String,

//     joinedAt: Date,

//     endedAt: Date,

//     duration: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "Session",
//   sessionSchema
// );

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    hostUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participantUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: String,
      default: "",
    },

    sessionType: {
      type: String,
      enum: ["instant", "scheduled"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "upcoming",
        "ongoing",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },

    startTime: Date,
    endTime: Date,

    meetingProvider: {
      type: String,
      default: "agora",
    },

    meetingRoomId: String,
    token: String,

    joinedAt: Date,
    endedAt: Date,

    duration: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
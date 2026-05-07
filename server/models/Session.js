// const mongoose = require("mongoose");

// const sessionSchema = new mongoose.Schema(
//   {
//     users: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ],

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "rejected"],
//       default: "pending",
//     },

//     type: {
//       type: String,
//       enum: ["instant", "scheduled"],
//       default: "scheduled",
//     },

//     scheduledDate: Date,
//     startTime: String,

//     meetingLink: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "rejected",
      ],
      default: "pending",
    },

    type: {
      type: String,
      enum: ["instant", "scheduled"],
      default: "scheduled",
    },

    scheduledDate: Date,

    startTime: String,

    meetingLink: String,

    joinedAt: Date,

    endedAt: Date,

    duration: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
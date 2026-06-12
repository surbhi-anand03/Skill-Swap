const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: [
      "request",
      "accepted",
      "session",
      "sessionAccepted",
      "sessionRejected",
      "chat"
    ]
  },

  message: String,

  isRead: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
}
);

module.exports =
mongoose.model(
"Notification",
notificationSchema
);
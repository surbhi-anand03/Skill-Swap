// const Notification =
// require("../models/Notification");

// exports.getNotifications =
// async (req,res)=>{

// try{

// const notifications =
// await Notification.find({
// user:req.user.id
// })
// .populate(
// "sender",
// "name bio profileImage"
// )
// .sort({
// createdAt:-1
// });

// res.json(notifications);

// }
// catch(err){

// res.status(500).json({
// error:err.message
// });

// }

// };

const Notification =
require("../models/Notification");


// ================= GET NOTIFICATIONS =================

exports.getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        user: req.user.id,
        isRead: false
      })
      .populate(
        "sender",
        "name bio profileImage"
      )
      .sort({
        createdAt: -1
      });

    res.json(notifications);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


// ================= MARK AS READ =================

exports.markAsRead =
async (req, res) => {

  try {

    await Notification.findByIdAndUpdate(

      req.params.id,

      {
        isRead: true
      }

    );

    res.json({
      message: "Notification marked as read"
    });

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};
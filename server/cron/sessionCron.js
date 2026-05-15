const cron = require("node-cron");

const Session = require(
  "../models/Session"
);

cron.schedule("* * * * *", async () => {

  const now = new Date();

  // upcoming -> ongoing

  await Session.updateMany(
    {
      status: "upcoming",
      startTime: { $lte: now },
    },
    {
      status: "ongoing",
    }
  );

  // ongoing -> completed

  await Session.updateMany(
    {
      status: "ongoing",
      endTime: { $lte: now },
    },
    {
      status: "completed",
    }
  );
});
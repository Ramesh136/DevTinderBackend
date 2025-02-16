const cron = require("node-cron");
const connectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEMail = require("../utils/sendEmail");

cron.schedule("0 9 * * *", async () => {
  console.log("Hello world " + new Date() + " from node-cron");

  try {

    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await connectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd
      }
    }).populate("fromId toId");

    const emailList = [
      ...new Set(pendingRequest.map((req) => { return { email: req.toId.emailId, name: req.toId.firstName } }))
    ];

    console.log(emailList);

    for (const email of emailList) {
      try {
        const response = await sendEMail.run("New friend request for " + email.name , "Day request summary")
        console.log(response)
      }
      catch (err) {
        console.log(err);
      }
    }

  }
  catch (err) {
    console.log(err);
  }
})
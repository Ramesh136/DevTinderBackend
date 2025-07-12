const mongoose = require("mongoose");
const { validate } = require("./users");

const messageSchema = new mongoose.Schema({
  from : {
    type : mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  to: {
    type : mongoose.Types.ObjectId,
    ref : "User",
    required: true
  },
  message : {
    type : String,
    required: true
  }
},{ timestamps : true})

const chatSchema = new mongoose.Schema({
  participants : [{
    type: mongoose.Types.ObjectId,
    required:true,
    ref: "User"
  }],
  messages : [messageSchema]
})



module.exports = mongoose.model("Chat", chatSchema);
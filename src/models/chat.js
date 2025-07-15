const mongoose = require("mongoose");

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
    ref: "User",
    validate : {
      validator : (value)=>{
        if(mongoose.isValidObjectId(value)){
          throw new Error("Invalid Id , kindly check");
        }
      }
    }
  }],
  messages : [messageSchema]
})



module.exports = mongoose.model("Chat", chatSchema);
const express  = require("express");
const chatRouter = express.Router();
const { authUser } = require("../middleware/auth");

const User = require("../models/users");
const Chat = require("../models/chat");

chatRouter.get("/chat/:targetId", authUser , async (req , res) =>{

  let { targetId } = req?.params ;
  let sender = req?.user ;
  let senderId = sender._id ;

  let targetUser = await User.findById(targetId).select("firstName lastName photoUrl");
  try{
   
    if(!targetUser){
      throw new Error("Invalid target id");
    }

    let chats = await Chat.findOne({
      participants : {
        $all : [senderId , targetId ]
      }
    })

    // console.log("chats",chats);
    

    if(!chats){
      res.status(206).json({
          message : "No chat history found",
          targetUser
      })
      return;
    }

    res.json({
     targetUser,
     chats
    });
  
    // console.log("chat requested",targetUser , req.user );
  }catch(error){
    res.status(404).json({
      message : error.message,
      targetUser
    })
  }

  

} )

module.exports = chatRouter ;
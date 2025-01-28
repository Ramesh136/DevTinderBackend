const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middleware/auth");
const User = require("../models/users");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/:status/:toUserId", authUser ,async (req,res)=>{
  try{
    const fromUser = req.user ;
    const status = req.params?.status;
    const vaildStatus = ["interested","ignored"];

    if(!vaildStatus.includes(status)){
      throw new Error("Invalid request type")
    }

    const toId = req.params?.toUserId;
    const fromId = fromUser._id;
    const toUser = await User.findById(toId);

    if(!toUser){
      throw new Error("Invalid user request");
    }

    const connectionRequest = new ConnectionRequest({
      fromId : fromUser._id,
      toId : toUser._id,
      status : status
    });

    const existingConnection = await ConnectionRequest.findOne({
      $or : [
        {fromId,toId},
        {fromId:toId,toId:fromId}
      ]
    });

    if(existingConnection){
      throw new Error("Connection already exists");
    }

    await connectionRequest.save();

    const message = status === "interested" ? `${fromUser.firstName} is interested in ${toUser.firstName}` : `${fromUser.firstName} is not interested in ${toUser.firstName}`;

    res.json({
      message: message
    });

  }
  catch(err){
    res.status(400).json({message:err.message});
  }
})



module.exports = requestRouter ;
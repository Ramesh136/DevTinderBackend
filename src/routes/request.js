const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middleware/auth");
const User = require("../models/users");
const ConnectionRequest = require("../models/connectionRequest");
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

requestRouter.post("/request/:status/:toUserId", authUser ,async (req,res)=>{
  try{
    const fromUser = req.user ;
    const status = req.params?.status;
    const vaildStatus = ["interested","ignored"];

    // Status validation
    if(!vaildStatus.includes(status)){
      throw new Error("Invalid request type")
    }

    const toId = req.params?.toUserId;
    const fromId = fromUser._id;
    const toUser = await User.findById(toId);

    // target userId validation
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
    const response = await sendEmail.run(message , "Request Notification");
    console.log(response)
    res.json({
      message: message
    });

  }
  catch(err){
    res.status(400).json({message:err.message});
    console.log(err)
  }
})

requestRouter.post("/review/:status/:requestId" , authUser , async (req,res)=>{

  try{
    const currentUser = req.user;
    const { status , requestId } = req?.params;

    const allowedStatus = ["accepted" , "rejected"];
    if(!allowedStatus.includes(status)){
      throw new Error("Invalid Status , status not acceptable");
    }

    const requestedConnection = await ConnectionRequest.findOne({
      _id:requestId,
      toId:currentUser._id,
      status: "interested"
    }).populate("fromId","firstName lastName")

    if(!requestedConnection){
      throw new Error("Invalid request");
    }

    requestedConnection.status = status ;
    await requestedConnection.save();

    let message

    if(status === "accepted"){
      message = `You are now connected with ${requestedConnection.fromId.firstName} ${requestedConnection.fromId.lastName}`;
    }
    else{
      message = `You have rejected ${requestedConnection.fromId.firstName} ${requestedConnection.fromId.lastName}`;
    }

    const response = await sendEmail.run(message , "Review Notification");
    console.log(response)

    res.json({
      data : message
    })
  }
  catch(err){
    res.status(400).json({
      message: err.message
    })
  }
})

module.exports = requestRouter ;
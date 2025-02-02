const express = require('express');
const userRouter = express.Router();
const { authUser } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_INFO_FIELDS = "firstName lastName  age  gender skills photoUrl"

userRouter.get("/user/requests/recieved", authUser , async (req , res) => {

  try {
    const currentUser = req.user ;

    const requests = await ConnectionRequest.find({
      toId : currentUser._id,
      status: "interested"
    }).populate("fromId",USER_INFO_FIELDS)

    if(requests.length === 0){
      return res.json({
        data : "No active requests"
      })
    }

    const responseData = requests.map((user)=>{
      return {
        firstName : user.fromId.firstName,
        lastName : user.fromId.lastName,
        age: user.fromId.age,
        skills : user.fromId.skills,
        photoUrl : user.fromId.photoUrl
      }
    })

    res.json({
      data : {
        requests : responseData,
        count : requests.length
      }
    })
  }
  catch(err){
    res.status(400).json({
      message : err.message
    })
  }
})

userRouter.get("/user/connections" , authUser , async (req,res)=>{

  try {
    const currentUser = req.user ;

    const connections = await ConnectionRequest.find({
      $or : [
        {toId : currentUser._id , status : "accepted"},
        {fromId: currentUser._id , status: "accepted" }
      ]
    }).populate("fromId",USER_INFO_FIELDS)
    .populate("toId",USER_INFO_FIELDS)

    if(connections.length === 0){
      return res.json({
        data : {
          connections : "No available connections"
        }
      })
    }

    const responseData = connections.map((connection)=>{
      if(connection.fromId._id.toString() === currentUser._id.toString()){
        return {
          firstName : connection.toId.firstName,
          lastName : connection.toId.lastName,
          age: connection.toId.age,
          skills : connection.toId.skills,
          photoUrl : connection.toId.photoUrl
        }
      }
      else{
        return {
          firstName : connection.fromId.firstName,
          lastName : connection.fromId.lastName,
          age: connection.fromId.age,
          skills : connection.fromId.skills,
          photoUrl : connection.fromId.photoUrl
        }
      }
    })

    res.json({
      data : {
        connections : responseData
      }
    })
  }
  catch(err){
    res.status(400).json({
      message : err.message
    })
  }
})


module.exports = userRouter ;
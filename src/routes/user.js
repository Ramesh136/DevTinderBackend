const express = require('express');
const userRouter = express.Router();
const { authUser } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const USER_INFO_FIELDS = "firstName lastName  age  gender skills photoUrl about"

userRouter.get("/user/requests/recieved", authUser , async (req , res) => {

  try {
    const currentUser = req.user ;

    const requests = await ConnectionRequest.find({
      toId : currentUser._id,
      status: "interested"
    }).populate("fromId",USER_INFO_FIELDS)

    // if(requests.length === 0){
    //   return res.json({
    //     data : "No active requests"
    //   })
    // }

    const responseData = requests.map((user)=>{
      return {
        requestId : user._id,
        id : user.fromId._id,
        firstName : user.fromId.firstName,
        lastName : user.fromId.lastName,
        about : user.fromId.about,
        age: user.fromId.age,
        gender : user.fromId.gender,
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
    });
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

    // if(connections.length === 0){
    //   return res.json({
    //     data : {
    //       connections : "No available connections"
    //     }
    //   })
    // }

    const responseData = connections.map((connection)=>{
      if(connection.fromId._id.toString() === currentUser._id.toString()){
        return {
          id : connection.toId._id,
          firstName : connection.toId.firstName,
          lastName : connection.toId.lastName,
          age: connection.toId.age,
          gender : connection.toId.gender,
          skills : connection.toId.skills,
          photoUrl : connection.toId.photoUrl,
          about : connection.toId.about
        }
      }
      else{
        return {
          id : connection.fromId._id,
          firstName : connection.fromId.firstName,
          lastName : connection.fromId.lastName,
          age: connection.fromId.age,
          gender : connection.fromId.gender,
          skills : connection.fromId.skills,
          photoUrl : connection.fromId.photoUrl,
          about : connection.fromId.about
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
    });
  }
})

userRouter.get("/user/feed" , authUser , async (req, res)=>{

  try {
    const currentUser = req.user ;

    const page = req.query?.page || 1;
    let limit = req.query?.limit || 10;

    limit = limit > 50 ? 50 : limit ;

    let skip = (page - 1)*limit ;

    const existingConnections = await ConnectionRequest.find({
      $or : [
        { fromId : currentUser._id },
        { toId : currentUser._id}
      ]
    })

    let hiderUsers = new Set();

    existingConnections.map((connection)=>{
      hiderUsers.add(connection.fromId.toString());
      hiderUsers.add(connection.toId.toString());
    })

    const feedUsers = await User.find({
      $and : [
        {_id : { $nin : Array.from(hiderUsers)}},
        {_id : { $ne : currentUser._id} }
      ]
    })
    .select(USER_INFO_FIELDS)
    .skip(skip)
    .limit(limit);

    res.json({
      data : {
        feed : feedUsers
      }
    });
  }
  catch(err){
    res.status(400).json({
      message : err.message
    });
  }
})


module.exports = userRouter ;
const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { authUser } = require("../middleware/auth");


profileRouter.get("/profile" ,authUser , async (req,res)=>{
  try{
    res.send(req.user);
  }
  catch(err){
    res.status(400).send("User not found");
  }
})


profileRouter.delete("/profile/:userId", async (req,res)=>{
  const userId = req.params?.userId;
  try{
    await User.findByIdAndDelete({_id:userId});
    res.send("User deleted successfully");
  }
  catch(err){
    res.status(404).send("User not found");
  }
  
})

profileRouter.patch("/profile/:userId", async (req,res)=>{
  const userId = req.params?.userId
  const data = req.body
  const UPDATES_ALLOWED = ["firstName","lastName","gender","age","skills","password","photoUrl"]
  try{
    const isUpdateAllowed = Object.keys(req.body).every((key)=>UPDATES_ALLOWED.includes(key))
    if(!isUpdateAllowed){
      throw new Error("Cant update these fields")
    }
    await User.findByIdAndUpdate(userId , data , {runValidators : true })
    res.send("User updated successfully")
  }
  catch(err){
    res.status(404).send(err.message)
  }
  
})


module.exports = profileRouter ;
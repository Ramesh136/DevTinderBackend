const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { authUser } = require("../middleware/auth");
const { validateUpdateData , validateUpdatePasswordData } = require("../utils/validate");


profileRouter.get("/profile/view" ,authUser , async (req,res)=>{
  try{
    res.json({
      user : {
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        skills : req.user.skills,
        photoUrl : req.user.photoUrl,
        gender : req.user.gender,
        age : req.user.age,
        about : req.user.about
      }
    });
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

profileRouter.patch("/profile",authUser, async (req,res)=>{
  const loggedInUser = req.user;
  try{
    validateUpdateData(req , res)
    Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);
    await loggedInUser.save()
    res.json({
      message : `${loggedInUser.firstName} , data updated succesfull`,
      user : {
        firstName : loggedInUser.firstName,
        lastName : loggedInUser.lastName,
        skills : loggedInUser.skills,
        photoUrl : loggedInUser.photoUrl,
        gender : loggedInUser.gender,
        age : loggedInUser.age,
        about : loggedInUser.about
      }
    })
  }
  catch(err){
    res.status(400).send(err.message)
  }
})

profileRouter.patch("/profile/password", authUser , async (req, res)=>{

  try{
    validateUpdatePasswordData(req);
    const currentUser = req.user;
    const { oldPassword , newPassword } = req.body ;
    const isOldPasswordValid = await currentUser.validatePassword(oldPassword);
    // re verifying by entering old password before changing
    if(!isOldPasswordValid){
      throw new Error("Wrong password , try again");
    }

    // checking if new password is strong
    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Enter Strong password");
    }

    const newHashPassword = await bcrypt.hash(newPassword,10);
    currentUser["password"] = newHashPassword;
    await currentUser.save();
    res.json({
      message : `${currentUser.firstName} , your password has been changes succesfully`,
      user : currentUser
    })
  }
  catch(err){
    res.status(400).send(err.message);
  }


})


module.exports = profileRouter ;
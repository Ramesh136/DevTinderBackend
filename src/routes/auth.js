const express = require("express");
const authRouter = express.Router();
const User = require("../models/users");
const {validateSignUp} = require("../utils/validate");
const bcrypt = require("bcrypt")


authRouter.post("/signup",async (req,res)=>{

  try{
    // validating request body
    validateSignUp(req)

    // encrypting password
    const {firstName , lastName , emailId , password,  age , gender , skills , photoUrl , about } = req.body ;
    const hashPassword = await bcrypt.hash(password , 10);

    const user = new User({
      firstName ,
      lastName ,
      age ,
      emailId ,
      gender ,
      skills ,
      photoUrl,
      about,
      password : hashPassword
    })
    await user.save()
    res.send("Data stored successfully")
  }
  catch(err){
    console.log(err)
    res.status(400).send("Error occured => "+ err.message)
  }
})

authRouter.post("/login", async (req,res)=>{
  const { emailId , password} = req.body;
  try{
    const user = await User.findOne({ emailId : emailId });
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
  
    if(isPasswordValid){
      // creating a jwt token , on valid password
      const token = await user.getJWT();
      if(token){
        res.cookie("token",token , { expires : new Date(Date.now() + 8 * 3600000) });
      }
      res.json({
          user : {
            firstName : user.firstName,
            lastName : user.lastName,
            skills : user.skills,
            photoUrl : user.photoUrl,
            gender : user.gender,
            age : user.age,
            about : user.about
          }
      });
    }
    else{
      throw new Error("Invalid credentials");
    }
  }
  catch(err){
    res.status(400).send(err.message);
  }
})

authRouter.post("/logout",(req,res)=>{
  res.cookie("token",null , {
    expires : new Date(Date.now())
  });
  res.send("User Logged out successfull");
})

module.exports = authRouter;
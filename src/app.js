const express = require('express');
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/users");
const { validateSignUp } = require("./utils/validate");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json());
app.use(cookieParser())

app.post("/signup",async (req,res)=>{

  try{
    // validating request body
    validateSignUp(req)

    // encrypting password
    const {firstName , lastName , emailId , password,  age , gender , skills } = req.body ;
    const hashPassword = await bcrypt.hash(password , 10);

    const user = new User({
      firstName ,
      lastName ,
      age ,
      emailId ,
      gender ,
      skills ,
      photoUrl,
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

app.post("/login", async (req,res)=>{

  const { emailId , password} = req.body;
  try{
    const user = await User.findOne({ emailId : emailId });
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare( password , user.password);
  
    if(isPasswordValid){

      // creating a jwt token , on valid password
      const token = jwt.sign( {_id : user._id},"DevTinder@9709")
      if(token){
        res.cookie("token",token)
      }
      res.send("Login Successfull")
    }
    else{
      throw new Error("Invalid credentials")
    }
  }
  catch(err){
    res.status(400).send(err.message)
  }
})

app.get("/user",async (req,res)=>{
  const userEmail = req.body.email

  try{
    const resUsers = await User.find({ emailId : userEmail})
    if(resUsers.length === 0){
      res.status(404).send("User not found")
    }
    else{
      res.send(resUsers)
    }
  }
  catch(err){
    res.status(404).send("User not found")
  }
})

app.delete("/user", async (req,res)=>{
  const userId = req.body.userId
  try{
    await User.findByIdAndDelete({_id:userId})
    res.send("User deleted successfully")
  }
  catch(err){
    res.status(404).send("User not found")
  }
  
})

app.patch("/user/:userId", async (req,res)=>{
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

app.get("/users",async (req,res)=>{
  try{
    const resUsers = await User.find({})
    if(resUsers.length === 0){
      res.status(404).send("Users not found")
    }
    else{
      res.send(resUsers)
    }
  }
  catch(err){
    res.status(404).send("User not found")
  }
})

app.get("/profile" , async (req,res)=>{

  try{
    const cookie = req.cookies ;
    const { token } = cookie ;
  
    if(!token){
      throw new Error("Invalid token")
    }
    const decryptId = jwt.decode(token)
    const user = await User.findOne({_id:decryptId})

    if(!user){
      throw new Error("User not found")
    }
    res.send(user)
  }
  catch(err){
    res.status(400).send(err.message)
  }
})

connectDB()
.then(()=>{
  console.log('DB connected successfully');
  app.listen(9709,()=>{
    console.log('Server is listening');
  });
})
.catch((err)=>{
  console.log("Cant connect");
})

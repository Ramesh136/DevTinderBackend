const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middleware/auth");

requestRouter.get("/sendConnectionRequest", authUser ,(req,res)=>{
  try{
    res.send(req.user);
  }
  catch(err){
    res.status(400).send("User not found");
  }
})



module.exports = requestRouter ;
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authUser = async (req , res , next)=>{
  try{

    const {token} = req.cookies ;
    if(!token){
      throw new Error("Invalid Token");
    }

    const deccryptObj = jwt.decode(token , "DevTinder@9709");
    const { _id } = deccryptObj;

    const user = await User.findById(_id);
    if(!user){
      throw new Error("User not found");
    }
    req.user = user ;
    next();
  }
  catch(err){
    res.status(400).send("Error : "+err.message);
  } 

}

module.exports = { authUser }
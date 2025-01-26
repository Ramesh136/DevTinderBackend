const validator = require("validator");
const bcrypt = require("bcrypt");


const validateSignUp = (req)=>{
  const {firstName , lastName , emailId , password , age , gender } = req.body ;

  if(!firstName || !lastName){
    throw new Error("Enter a valid name");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Enter a valid emial");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Enter strong password");
  }
}

const validateUpdateData = async (req)=>{

  const {firstName , lastName , emailId , age , gender } = req.body ;
  const UPDATES_ALLOWED = ["firstName","lastName","gender","age","skills","emailId","photoUrl"]
  try{
    const isUpdateAllowed = Object.keys(req.body).every((key)=>UPDATES_ALLOWED.includes(key))
    if(!isUpdateAllowed){
      throw new Error("Cant update these fields")
    }
    if(!firstName || !lastName){
      throw new Error("Enter a valid name");
    }
    else if(!validator.isEmail(emailId)){
      throw new Error("Enter a valid emial");
    }
  }
  catch(err){
    res.status(404).send(err.message)
  }
}

const validateUpdatePasswordData = async (req)=>{

  try{
    const data = req.body;
    const FIELDS_ALLOWED = ["oldPassword","newPassword"];
    const isFieldsValid = Object.keys(data).every((key)=>FIELDS_ALLOWED.includes(key));
    if(!isFieldsValid){
      throw new Error("Enter old password and new password to continue.");
    }
  }
  catch(err){
    res.status(400).send(err.message)
  }

}

module.exports = {
  validateUpdateData,
  validateSignUp,
  validateUpdatePasswordData
}
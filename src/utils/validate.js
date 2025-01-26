const validator = require("validator")

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

module.exports = {
  validateSignUp
}
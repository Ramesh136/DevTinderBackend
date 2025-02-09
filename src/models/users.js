const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required: true,
    minLength : 3,
    maxLength : 20
  },
  lastName : {
    type : String
  },
  about : {
    type : String,
    default : "This is default about of an user"
  },
  emailId : {
    type : String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    validate : {
      validator : (value)=>{
        if(!validator.isEmail(value)){
          throw new Error("Email is invalid "+ value)
        }
      }
    }
  },
  password : {
    type : String,
    required: true,
    trim: true,
    validate : {
      validator : (value)=>{
        if(!validator.isStrongPassword(value)){
          throw new Error("Password is not strong "+ value)
        }
      }
    }
  },
  age : {
    type : Number,
    min: 18
  },
  gender : {
    type : String,
    lowercase: true,
    validate: {
      validator: (value)=>{
        if(!["male","female","others"].includes(value)){
          throw new Error("gender is not valid")
        }
      }
    }
  },
  photoUrl: {
    type : String,
    default : "https://cdn.vectorstock.com/i/2000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif",
    // validate : {
    //   validator : (value)=>{
    //     if(!validator.isURL(value)){
    //       throw new Error("Photo url is invalid =>"+value)
    //     }
    //   }
    // }
  },
  skills : {
    type : [String],
    validate: {
      validator: (value)=>{
        if(value.length > 4){
          throw new Error("Max 4 skills allowed")
        }
      }
    }
  }
},{ timestamps: true})

userSchema.methods.getJWT = function(){
  const user = this;
  const token = jwt.sign({ _id: user._id},"DevTinder@9709");
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser,user.password);
  return isPasswordValid ;
}

module.exports = mongoose.model("User",userSchema);
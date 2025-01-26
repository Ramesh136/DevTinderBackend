const mongoose = require("mongoose")
const validator = require("validator")

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
    validate : {
      validator : (value)=>{
        if(!validator.isURL(value)){
          throw new Error("Photo url is invalid =>"+value)
        }
      }
    }
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

module.exports = mongoose.model("User",userSchema);
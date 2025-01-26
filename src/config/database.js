const mongoose = require("mongoose")

const connectDB = async ()=>{
  await mongoose.connect('mongodb+srv://ramtheertha:dMHu8CHefvxBuIyh@firstdb.wle4c.mongodb.net/devTinder')
}

module.exports = { connectDB } 
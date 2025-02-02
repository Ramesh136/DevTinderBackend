const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  toId : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  status : {
    type: String,
    enum : {
      values : ["interested","accepted" , "rejected" , "ignored"],
      message : '{VALUE} is not a valid status'
    }
  }
}, { timestamps: true });

connectionRequestSchema.pre("save",function(next){
  if(this.fromId.equals(this.toId)){
    throw new Error("Cant send request to self");
  }
  next();
});

const connectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;

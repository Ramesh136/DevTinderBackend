const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
  res.send("Hello from server : AS");
})

app.get("/user", (req,res)=>{
  res.send({fname: "Ramesh" , lname:"B"});
})

app.post("/user/:groupid", (req,res)=>{
  console.log(req.query)
  console.log(req.params)
  res.send("Data stored");
})

app.listen(9709,()=>{
  console.log('Server is listening');
});
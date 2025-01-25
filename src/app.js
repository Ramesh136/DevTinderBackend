const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
  res.send("Hello from server : AS")
})

app.listen(9709,()=>{
  console.log('Server is listening')
});
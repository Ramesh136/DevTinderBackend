const express = require('express');
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authUser } = require("./middleware/auth");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profiles');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(()=>{
  console.log('DB connected successfully');
  app.listen(9709,()=>{
    console.log('Server is listening');
  });
})
.catch((err)=>{
  console.log("Cant connect");
})

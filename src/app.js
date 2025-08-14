const express = require('express');
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profiles');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();

const { initializeSocket } = require("./utils/socket");
const chatRouter = require('./routes/chats');
const io = initializeSocket(server);

require("../src/utils/cronjob");

app.use(cors({
  origin: "https://dev-tinder-wine.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

connectDB()
.then(()=>{
  console.log('DB connected successfully');
  server.listen(process.env.PORT,()=>{
    console.log('Server is listening');
  });
})
.catch((err)=>{
  console.log("Cant connect");
})

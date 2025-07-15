const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://ezcnkt.online",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("joinRoom", ({ userId , targetUserId , userName}) => {
      let roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
      console.log(`Client ${userName} joined room: ${JSON.stringify(roomId)}`);
    });

    socket.on("sendMessage", async ({ userId, targetUserId, message , userName }) => {
      let roomId = [userId, targetUserId].sort().join("_");
      console.log(`Message from ${userName}-${userId} to ${targetUserId}: ${message} to room ${roomId}`);

      let chat = await Chat.findOne({
        participants : {
          $all : [userId , targetUserId]
        }
      })

      if(chat){
        // console.log("chat",chat);
        chat.messages.push({
          from:userId,
          to:targetUserId,
          message: message
        })

        let response = await chat.save();
        // console.log("response",response);
        
      }
      else {
        console.log("Chat not found , create a new chat");
        let chat = new Chat({
          participants : [userId , targetUserId],
          messages : [{
            from : userId,
            to : targetUserId,
            message : message
          }]
        })
        let savedChat = await chat.save();
        console.log("savedChat",savedChat);
      }

      io.to(roomId).emit("receiveMessage", { userId, targetUserId, message , userName , time : new Date() });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return io;
}


module.exports = { initializeSocket };
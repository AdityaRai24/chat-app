import { Server as SocketIoServer } from "socket.io";
import Message from "./models/Message.js";
const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected : ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected ${userId} with ${socket.id}`);
    } else {
      console.log("user id not provided during connection.");
    }

    socket.on("send_message", async ({ sender, receiver, message }) => {
      try {
        const createdMessage = await Message.create({
          sender,
          receiver,
          content: message,
          messageType: "text",
        });
        const messageData = await Message.findById(createdMessage._id)
          .populate("sender", "id email firstName lastName profilePic")
          .populate("receiver", "id email firstName lastName profilePic");

        const receiverSocketId = userSocketMap.get(receiver);
        const senderSocketId = userSocketMap.get(sender);

        if (receiverSocketId) {
          socket.to(receiverSocketId).emit("receive_message", messageData);
        }
        if (senderSocketId && senderSocketId !== socket.id) {
          socket.to(senderSocketId).emit("receive_message", messageData);
        }
        socket.emit("receive_message", messageData);
      } catch (error) {
        console.log({ error });
      }
    });

    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;

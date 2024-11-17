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

  // Broadcast user status to all connected clients
  const broadcastUserStatus = (userId, status) => {
    io.emit("user_status_change", {
      userId,
      status,
    });
  };

  const disconnect = (socket) => {
    console.log(`Client disconnected : ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        broadcastUserStatus(userId, "Offline");
        break;
      }
    }
  };

  const handleUserDisconnect = (socket) => {
    socket.on("disconnect", () => disconnect(socket));
    socket.on("beforeunload", () => disconnect(socket));
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected ${userId} with ${socket.id}`);
      broadcastUserStatus(userId, "Online");
    } else {
      console.log("user id not provided during connection.");
    }

    socket.on("typing_start", ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("typing_status", {
          userId: senderId,
          isTyping: true,
        });
      }
    });

    socket.on("typing_stop", ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("typing_status", {
          userId: senderId,
          isTyping: false,
        });
      }
    });

    socket.on("getUserStatus", ({ userId }) => {
      const userSocketId = userSocketMap.get(userId);
      if (userSocketId) {
        socket.emit("user_current_status", "Online");
      } else {
        socket.emit("user_current_status", "Offline");
      }
    });

    socket.on("send_message", async ({ sender, receiver, message, type }) => {
      try {
        let messageDataArray = [];
        const messageContent = type === "text" ? message : "Sent a file";

        if (type === "text") {
          // Handle text messages
          const createdMessage = await Message.create({
            sender,
            receiver,
            content: message,
            messageType: "text",
          });

          const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName profilePic")
            .populate("receiver", "id email firstName lastName profilePic");

          messageDataArray.push(messageData);
        } else {
          // Handle multiple file messages
          const createdMessages = await Promise.all(
            message.map((file) =>
              Message.create({
                sender,
                receiver,
                fileUrl: file,
                messageType: "file",
              })
            )
          );

          for (const createdMessage of createdMessages) {
            const messageData = await Message.findById(createdMessage._id)
              .populate("sender", "id email firstName lastName profilePic")
              .populate("receiver", "id email firstName lastName profilePic");

            messageDataArray.push(messageData);
          }
        }

        // Chat list updates
        const senderChatUpdate = {
          _id: messageDataArray[0].receiver._id,
          firstName: messageDataArray[0].receiver.firstName,
          lastName: messageDataArray[0].receiver.lastName,
          profilePic: messageDataArray[0].receiver.profilePic,
          email: messageDataArray[0].receiver.email,
          lastMessage: messageContent,
          timestamp: new Date(),
        };

        const receiverChatUpdate = {
          _id: messageDataArray[0].sender._id,
          firstName: messageDataArray[0].sender.firstName,
          lastName: messageDataArray[0].sender.lastName,
          profilePic: messageDataArray[0].sender.profilePic,
          email: messageDataArray[0].sender.email,
          lastMessage: messageContent,
          timestamp: new Date(),
        };

        const receiverSocketId = userSocketMap.get(receiver);
        const senderSocketId = userSocketMap.get(sender);

        // Send all messages to the receiver
        if (receiverSocketId) {
          for (const messageData of messageDataArray) {
            socket.to(receiverSocketId).emit("receive_message", messageData);
          }
          socket
            .to(receiverSocketId)
            .emit("chat_list_update", receiverChatUpdate);
        }

        // Send all messages to the sender's other tabs/windows
        if (senderSocketId && senderSocketId !== socket.id) {
          for (const messageData of messageDataArray) {
            socket.to(senderSocketId).emit("receive_message", messageData);
          }
          socket.to(senderSocketId).emit("chat_list_update", senderChatUpdate);
        }

        // Send all messages to the current sender socket
        for (const messageData of messageDataArray) {
          socket.emit("receive_message", messageData);
        }
        socket.emit("chat_list_update", senderChatUpdate);
      } catch (error) {
        console.log({ error });
      }
    });

    handleUserDisconnect(socket);
  });
};

export default setupSocket;

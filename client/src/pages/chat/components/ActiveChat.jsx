import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import { FileIcon, Paperclip, SendIcon, SmileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomScroll } from "react-custom-scroll";

const ActiveChat = ({ chatDetails }) => {
  const { userInfo } = useAppStore();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(chatDetails.messages);
  const socket = useSocket();

  console.log(chatHistory, chatDetails);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      console.log(msg);
      setChatHistory((prev) => {
        if (prev.some((existingMsg) => existingMsg._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      sender: userInfo.id,
      receiver: chatDetails.receiver._id,
      message: message,
    });
    setMessage("");
  };

  return (
    <div className="w-[70vw]  flex flex-col items-start justify-between h-screen">
      <div className="px-5 py-3  border-b border-gray-700 w-full flex items-center justify-start gap-3">
        <Avatar className="h-12 w-12 cursor-pointer">
          <AvatarImage
            src={chatDetails.receiver.profilePic}
            alt={chatDetails.receiver.firstName}
          />
          <AvatarFallback>{chatDetails.receiver.firstName}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold text-white">
            {chatDetails.receiver.firstName} {chatDetails.receiver.lastName}
          </h1>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>

      <CustomScroll flex="1" className="w-full mt-6 flex flex-col">
        {chatHistory && chatHistory.length > 0 ? (
          chatHistory.map((item) => {
            return <Message key={item._id} message={item} />;
          })
        ) : (
          <div className="text-muted-foreground flex items-center justify-center h-[70vh]">
            No messages yet...
          </div>
        )}
      </CustomScroll>

      <div className="flex  border-t border-gray-700 items-center w-full px-5 py-3 gap-5 justify-between">
        <Paperclip color="#a0aec0" className="cursor-pointer" />
        <SmileIcon color="#a0aec0" className="cursor-pointer" />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full flex-1 bg-light py-5 text-white border-none outline-none focus-visible:ring-0"
          placeholder="Enter your message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <SendIcon
          onClick={() => handleSendMessage()}
          color="#a0aec0"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ActiveChat;

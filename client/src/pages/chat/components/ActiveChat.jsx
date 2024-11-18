import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomScroll } from "react-custom-scroll";
import ChatInput from "./ChatInput";

const ActiveChat = ({ chatDetails }) => {
  const [chatHistory, setChatHistory] = useState(chatDetails.messages);
  const [userCurrentStatus, setUserCurrentStatus] = useState("Offline");
  const socket = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setChatHistory(chatDetails.messages);
  }, [chatDetails]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReceiveMessage = (msg) => {
    setChatHistory((prev) => {
      if (prev.some((existingMsg) => existingMsg._id === msg._id)) {
        return prev;
      }
      return [...prev, msg];
    });
    setTimeout(scrollToBottom, 100);
  };

  const handleUsercurrentStatus = (status) => {
    setUserCurrentStatus(status);
  };

  // Listen for user status changes
  useEffect(() => {
    const handleStatusChange = ({ userId, status }) => {
      if (userId === chatDetails.receiver._id) {
        setUserCurrentStatus(status);
      }
    };

    socket.on("user_status_change", handleStatusChange);

    // Initial status check
    socket.emit("getUserStatus", { userId: chatDetails.receiver._id });
    socket.on("user_current_status", handleUsercurrentStatus);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      if (isVisible) {
        socket.connect();
      }
    };

    // Handle beforeunload event
    const handleBeforeUnload = () => {
      socket.emit("beforeunload");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("user_status_change", handleStatusChange);
      socket.off("getUserStatus");
      socket.off("user_current_status", handleUsercurrentStatus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, chatDetails.receiver._id]);

  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing_status", ({ userId, isTyping: typing }) => {
      if (userId === chatDetails.receiver._id) {
        setIsTyping(typing);
      }
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing_status");
    };
  }, [socket, chatDetails.receiver._id]);

  // Scroll to bottom on initial load and when chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatDetails.messages]);

  return (
    <div className="w-[70vw] flex flex-col items-start justify-between h-screen">
      <div className="px-5 py-3 border-b border-gray-700 w-full flex items-center justify-start gap-3">
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
          <span className="text-sm text-gray-400">
            {isTyping ? "Typing..." : userCurrentStatus}
          </span>
        </div>
      </div>

      <CustomScroll flex="1" className="w-full mt-6 flex flex-col">
        {chatHistory && chatHistory.length > 0 ? (
          <>
            {chatHistory.map((item) => (
              <Message key={item._id} message={item} />
            ))}
            <div ref={messagesEndRef} />{" "}
          </>
        ) : (
          <div className="text-muted-foreground flex items-center justify-center h-[70vh]">
            No messages yet...
          </div>
        )}
      </CustomScroll>

      <ChatInput chatDetails={chatDetails} />
    </div>
  );
};

export default ActiveChat;

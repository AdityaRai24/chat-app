import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChatsList from "./components/ChatsList";
import ActiveChat from "./components/ActiveChat";
import EmptyChat from "./components/EmptyChat";

const Chat = () => {
  const { userInfo, chatDetails } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex items-center justify-between w-full h-screen bg-[#1f2229]">
      <ChatsList />
      {chatDetails ? <ActiveChat chatDetails={chatDetails} /> : <EmptyChat />}
    </div>
  );
};

export default Chat;

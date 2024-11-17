import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const ChatsList = () => {
  const { userInfo, chatDetails, setChatDetails } = useAppStore();
  const [allUsers, setAllUsers] = useState([]);

  console.log({ chatDetails });

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/auth/getAllUsers`,
          { withCredentials: true }
        );
        setAllUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllUsers();
  }, []);

  const setActiveChat = async (item) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/messages/getUsersChat`,
        { id: item._id },
        { withCredentials: true }
      );
      setChatDetails({
        sender: userInfo,
        receiver: item,
        messages: response.data.messages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[30vw] h-screen p-5 border-r border-gray-700">
      <div className="flex items-center justify-start gap-1 bg-light px-3 py-1 rounded-xl text-muted-foreground">
        <SearchIcon color="#a0aec0" />
        <Input
          type="text"
          placeholder="Search"
          className="border-none text-[#E9EDEF] outline-none !text-md focus-visible:ring-0"
        />
      </div>
      <div className="mt-5">
        {allUsers.map((item) => (
          <div
            key={item._id}
            onClick={() => setActiveChat(item)}
            className="flex items-center justify-start gap-3 p-4 cursor-pointer hover:bg-light rounded-2xl"
          >
            <Avatar className="object-cover bg-center">
              <AvatarImage src={item.profilePic} alt={item.firstName} />
              <AvatarFallback>{item.firstName}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap">
              <span className="text-md text-white">
                {item.firstName} {item.lastName}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.lastMessage ?? "No message"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsList;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import axios from "axios";
import { SearchIcon, LogOut } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/SocketContext";

const ChatsList = () => {
  const { userInfo, setUserInfo,chatDetails, setChatDetails } = useAppStore();
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const chatListRef = useRef(new Map());

  const socket = useSocket();

  const fetchChatList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/contacts/getChatList`,
        { withCredentials: true }
      );
      const newChatList = response.data;
      setChatList(newChatList);

      chatListRef.current = new Map(
        newChatList.map((chat) => [chat._id, chat])
      );
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = (updateData) => {
      setChatList((prevList) => {
        const existingChatIndex = prevList.findIndex(
          (chat) => chat._id === updateData._id
        );

        if (existingChatIndex !== -1) {
          const newList = [...prevList];
          newList[existingChatIndex] = {
            ...newList[existingChatIndex],
            lastMessage: updateData.lastMessage,
            timestamp: updateData.timestamp,
          };
          const [updatedChat] = newList.splice(existingChatIndex, 1);
          return [updatedChat, ...newList];
        } else {
          return [updateData, ...prevList];
        }
      });
    };

    socket.on("chat_list_update", handleChatListUpdate);

    return () => {
      if (socket) {
        socket.off("chat_list_update", handleChatListUpdate);
      }
    };
  }, [socket]);

  const performSearch = async (value) => {
    if (value.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contacts/getSearchContacts`,
        { searchTerm: value },
        { withCredentials: true }
      );
      setSearchResults(response.data.contacts);
      setHasSearched(true);
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      performSearch(value);
    }, 500),
    []
  );

  const avatars = [
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar1_v0iyel.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar6_wwrn6w.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar4_antyye.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar5_srwogx.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar3_gilhl7.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731848588/avatar2_qqfac4.png",
  ];

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const setActiveChat = async (item) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/getUsersChat`,
        { id: item._id },
        { withCredentials: true }
      );

      setChatDetails({
        sender: userInfo,
        receiver: item,
        messages: response.data.messages,
      });

      setIsSearching(false);
      setSearchTerm("");
    } catch (error) {
      console.error("Error setting active chat:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if(response.status === 200) {
        setUserInfo(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const UserItem = ({ user }) => (
    <div
      key={user._id}
      onClick={() => setActiveChat(user)}
      className="flex items-center justify-start gap-3 p-4 cursor-pointer hover:bg-light rounded-2xl"
    >
      <div
        className={cn(
          "overflow-hidden rounded-full bg-[#1f2229]",
          avatars.includes(user.profilePic) ? "h-14 w-14" : "h-10 w-10"
        )}
      >
        <img
          src={user.profilePic}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-md text-white">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-sm text-muted-foreground">
          {user.lastMessage ?? "No message"}
        </span>
      </div>
    </div>
  );

  const renderUsers = () => {
    if (searchTerm.trim() === "") {
      return chatList.length > 0 ? (
        chatList.map((user) => <UserItem key={user._id} user={user} />)
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          Search for users to start a conversation
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          Searching...
        </div>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No contacts found
        </div>
      );
    }

    return searchResults.map((user) => <UserItem key={user._id} user={user} />);
  };

  return (
    <div className="w-[30vw] h-screen p-5 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-start gap-2 bg-light px-3 py-2 rounded-xl text-muted-foreground">
        <SearchIcon color="#a0aec0" />
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-none text-light_white outline-none !text-md focus-visible:ring-0"
        />
      </div>
      <div className="mt-5 flex-1 overflow-y-auto">{renderUsers()}</div>
      <Separator className="my-4" />
      <Card className="bg-light border-none">
        <CardContent className="p-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userInfo?.profilePic} alt="Profile picture" />
              <AvatarFallback>
                {userInfo?.firstName?.[0]}
                {userInfo?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-light_white">
                {userInfo?.firstName} {userInfo?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-[#1f2229]"
            >
              <LogOut className="h-5 w-5 text-light_white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatsList;

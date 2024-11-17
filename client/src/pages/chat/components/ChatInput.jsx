import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilesIcon,
  ImagesIcon,
  Paperclip,
  Send,
  SendIcon,
  SmileIcon,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ChatInput = ({ chatDetails }) => {
  const emojiPickerRef = useRef(null);
  const mediaInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isActiveUploadedImages, setIsActiveUploadedImages] = useState(false);
  const [activeUploadedImages, setActiveUploadedImages] = useState([]);

  const { userInfo } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    socket.emit("send_message", {
      sender: userInfo.id,
      receiver: chatDetails.receiver._id,
      message: message.trim(),
      type: "text",
    });
    setMessage("");
    setShowEmoji(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhanvyweu/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log({ data });
      return data;
    } catch (error) {
      toast.error("Error while uploading images...");
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleFileUpload = async (e, fileType) => {
    const files = Array.from(e.target.files);
    if (!files.length) {
      toast.error("No files selected");
      return;
    }
    if (files.length > 3) {
      toast.error("You can only upload 3 files at a time");
    }
    setIsUploading(true);
    console.log("Starting upload process...");
    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File size should be less than 10mb for ${file.name}`);
          setIsUploading(false);
          return;
        }
        if (fileType === "media" && !file.type.match(/^(image|video)/)) {
          toast.error(`File ${file.name} is not a valid image or video.`);
        }
        const uploadedFile = await uploadToCloudinary(file);
        setIsUploading(false);
        setIsActiveUploadedImages(true);
        setActiveUploadedImages((prev) => [...prev, uploadedFile.secure_url]);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Failed to upload files");
    }
  };

  const handleMediaClick = () => {
    console.log("Media button clicked");
    mediaInputRef.current?.click();
  };

  const handleFileClick = () => {
    console.log("File button clicked");
    fileInputRef.current?.click();
  };

  const handleImageUploadCancel = () => {
    setIsActiveUploadedImages(false);
    setActiveUploadedImages([]);
  };

  const handleImageUploadSend = async () => {
    socket.emit("send_message", {
      sender: userInfo.id,
      receiver: chatDetails.receiver._id,
      message: activeUploadedImages,
      type: "image",
    });
    setIsActiveUploadedImages(false);
    setActiveUploadedImages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
    socket.emit("typing", userInfo.id);
  };

  return (
    <>
      {" "}
      <div
        className={cn(
          "fixed bottom-[10px] ml-4  bg-light py-4 px-8 rounded-lg z-[99999] ",
          isActiveUploadedImages ? "block" : "hidden"
        )}
      >
        <div className="flex items-center justify-start gap-3">
          {activeUploadedImages.map((item) => {
            return (
              <img
                src={item}
                className="w-[150px] shadow-sm object-cover shadow-white rounded-lg h-[150px]"
              />
            );
          })}
        </div>
        <div className="w-full mt-4 flex gap-2 items-center justify-between">
          <Button
            onClick={() => handleImageUploadCancel()}
            className="w-1/2 bg-transparent border-gray-600  hover:text-light_white hover:bg-transparent border-2 hover:border-2 hover:scale-[1.03] transition-all duration-300 ease-in text-light_white"
            variant="outline"
          >
            Cancel <XIcon />
          </Button>
          <Button
            onClick={() => handleImageUploadSend()}
            className="w-1/2 hover:bg-[#353463] border-2 border-transparent hover:border-2 hover:scale-[1.03] transition-all duration-300 ease-in bg-[#353463]"
          >
            Send <SendIcon />{" "}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "border-t border-gray-700 items-center w-full px-5 py-3 gap-5 justify-between relative",
          isActiveUploadedImages ? "hidden" : "flex"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isUploading}>
            <Paperclip
              color={isUploading ? "#666" : "#a0aec0"}
              className={`cursor-pointer ${isUploading ? "opacity-50" : ""}`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleMediaClick}>
              <div className="flex items-center gap-2 cursor-pointer">
                Images / Videos <ImagesIcon className="size-5" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFileClick}>
              <div className="flex items-center gap-2 cursor-pointer">
                Files <FilesIcon className="size-5" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* File inputs moved outside of DropdownMenuItem */}
        <input
          type="file"
          ref={mediaInputRef}
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            console.log("Media input change event");
            handleFileUpload(e, "media");
          }}
          disabled={isUploading}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            console.log("File input change event");
            handleFileUpload(e, "file");
          }}
          disabled={isUploading}
        />

        <div ref={emojiPickerRef} className="relative">
          <SmileIcon
            color="#a0aec0"
            className="cursor-pointer"
            onClick={() => setShowEmoji(!showEmoji)}
          />
          {showEmoji && (
            <div className="absolute bottom-12 left-0">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                emojiStyle="native"
                searchPlaceHolder="Search emoji..."
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full flex-1 bg-light py-5 text-white border-none outline-none focus-visible:ring-0"
          placeholder={isUploading ? "Uploading..." : "Enter your message"}
          onKeyDown={(e) => handleKeyDown(e)}
          disabled={isUploading}
        />
        <SendIcon
          onClick={handleSendMessage}
          color={isUploading ? "#666" : "#a0aec0"}
          className={`cursor-pointer ${isUploading ? "opacity-50" : ""}`}
        />
      </div>
    </>
  );
};

export default ChatInput;

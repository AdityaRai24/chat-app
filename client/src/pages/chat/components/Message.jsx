import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Message = ({ message }) => {
  const { userInfo } = useAppStore();
  const [showDialog, setShowDialog] = useState(false);
  const [currentDialogImage, setCurrentDialogImage] = useState("");
  const isFromMe = userInfo.id === message.sender._id;
  const isText = message.messageType === "text";
  const formattedTime = format(new Date(message.timestamp), "h:mm aaa");

  const handleDialogImage = () => {
    setCurrentDialogImage(message.fileUrl);
    setShowDialog(true);
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img
                src={currentDialogImage}
                className="rounded-lg cursor-pointer"
                alt="file"
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>{" "}
      <div
        className={cn(
          "w-full flex",
          isFromMe ? "justify-end" : "justify-start",
          "px-4 py-1"
        )}
      >
        <div
          className={cn(
            "max-w-[65%] relative",
            isFromMe ? "bg-[#353463]" : "bg-[#202C33]",
            "rounded-lg  break-words",
            isText ? "px-3 py-1.5" : " p-1 "
          )}
        >
          {isText ? (
            <div className="pr-14 text-[#E9EDEF] text-sm">
              {message.content}
            </div>
          ) : (
            <img
              onClick={() => handleDialogImage()}
              src={message.fileUrl}
              alt="file"
              className="object-cover rounded-lg cursor-pointer"
              width={250}
            />
          )}
          <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
            <span className="text-[11px] text-[#8696A0] min-w-[55px] text-right">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;

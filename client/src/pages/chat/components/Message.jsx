import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import React from "react";
import { format } from "date-fns";

const Message = ({ message }) => {
  const { userInfo } = useAppStore();
  const isReceiver = userInfo.id === message.receiver;

  const formattedTime = format(new Date(message.timestamp), "h:mm aaa");

  return (
    <div
      className={cn(
        "w-full flex",
        isReceiver ? "justify-start" : "justify-end",
        "px-4 py-1"
      )}
    >
      <div
        className={cn(
          "max-w-[65%] relative",
          isReceiver ? "bg-[#202C33]" : "bg-[#005C4B]",
          "rounded-lg px-3 py-1.5 break-words"
        )}
      >
        <div className="pr-14 text-[#E9EDEF] text-sm">{message.content}</div>
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
          <span className="text-[11px] text-[#8696A0] min-w-[55px] text-right">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;

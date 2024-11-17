import React from "react";
import myImage from "./messages.png";

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center w-full justify-start h-full p-8">
      <div className="text-center max-w-lg">
        <div className="">
          <img
            src={myImage}
            alt="Messages illustration"
            className="w-[500px] mx-auto"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-3 text-light_white dark:text-gray-200">
          No Conversation Selected
        </h2>

        <p className="text-muted-foreground ">
          Choose a person from the sidebar or search to start chatting
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;

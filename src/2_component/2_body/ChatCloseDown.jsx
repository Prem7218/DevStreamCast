import React from "react";
import { ChevronUp } from "lucide-react";
import { useOpen } from "../../3_context/openContext";

const ChatCloseDown = ({ toggleConnections, body }) => {
  const {setShowChat} = useOpen();
  return (
    <div className="flex items-center justify-between w-full h-[30px]">
      <p className="font-medium text-gray-700">
        {body ? "Chat Now: " : "Connections: "}
      </p>

      {/* 🔽 Down Caret When Closed | 🔼 Up Caret When Open */}
      <div
        className="cursor-pointer ml-2 text-white"
        onClick={() => {
          if (body)
            setShowChat((prev) => ({ ...prev, sleepChat: !prev?.sleepChat }));
          else toggleConnections();
        }}
      >
        <ChevronUp className="h-6 w-6 text-blue-600 transition-transform" />
      </div>
    </div>
  );
};

export default ChatCloseDown;

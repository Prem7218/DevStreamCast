import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { useOpen } from "../../3_context/openContext";
import PrivateChat from "./profile_post/chats/private_chat/PrivateChat";
import ChatCloseDown from "./ChatCloseDown";

const ChatWithDraganDrop = ({ userChatId, toggleConnections }) => {
  const [chatPosition, setChatPosition] = useState({ x: 100, y: 100 });
  const { showChat, setShowChat } = useOpen();
  const chatRef = useRef(null);
  const minimizedChatRef = useRef(null);

  const handleStop = (e, data) => {
    setChatPosition({ x: data.x, y: data.y });
  };

  return (
    <>
      {showChat?.showChat && (
        <>
          <Draggable
            nodeRef={chatRef} 
            position={chatPosition} 
            onStop={handleStop}
          >
            <div
              ref={chatRef}
              className={`transition-all duration-100 ease-in-out rounded-lg shadow-lg border border-gray-300 cursor-move w-0 ${
                showChat?.sleepChat ? "hidden" : "block bg-white"
              }`}
            >
              {!showChat?.sleepChat && (
                <PrivateChat
                  userChatId={userChatId}
                  toggleConnections={toggleConnections}
                  showChat={showChat}
                  setShowChat={setShowChat}
                />
              )}
            </div>
          </Draggable>

          {/* 🔹 Draggable Minimized Chat Icon */}
          <Draggable
            nodeRef={minimizedChatRef}
            position={chatPosition} 
            onStop={handleStop}
          >
            <div
              ref={minimizedChatRef}
              className={`absolute w-[80%] bottom-0 transition-all duration-100 ease-in-out rounded-md cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-3 py-2 hover:bg-white hover:text-black shadow-md border border-blue-400 ${
                showChat?.sleepChat ? "block text-white" : "hidden"
              }`}
            >
              {showChat?.sleepChat && (
                <ChatCloseDown
                  toggleConnections={toggleConnections}
                  body={true}
                  setShowChat={setShowChat}
                />
              )}
            </div>
          </Draggable>
        </>
      )}
    </>
  );
};

export default ChatWithDraganDrop;

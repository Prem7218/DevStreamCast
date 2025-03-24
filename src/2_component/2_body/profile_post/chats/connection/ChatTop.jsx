import React from "react";
import { useOpen } from "../../../../../3_context/openContext";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ChatTop = ({ userId }) => {
  const navigate = useNavigate();
  const { showChat, setShowChat} = useOpen();
  return (
    <>
      {!showChat?.showChat ? (
        <button
          onClick={() => navigate(`/profile/${userId}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiArrowLeft size={22} />
          <span>Back</span>
        </button>
      ) : (
        <button
          onClick={() => {
            console.log("Hello")
            const save = async () => {
              await setShowChat((prev) => ({ ...prev, showChat: false }))
            }

            save();
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiX size={22} />
          <span>Close</span>
        </button>
      )}
    </>
  );
};

export default ChatTop;

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Uploads } from "./Specials/Uploads";
import { FileUploading, Special } from "./Specials/Special";
import { useOpen } from "../../../../3_context/openContext";
import { ChevronDown } from "lucide-react";
import MessagesBoxing from "./Specials/MessagesBoxing";
import { database } from "../../../../constantData/firebase";
import { FiSend, FiX } from "react-icons/fi";
import { onValue, push, ref } from "firebase/database";
import { useOpenZustand } from "../../../../4_Zustand/useOpenZustand";

const AnonymousChat = () => {
  const [upload, setUploads] = useState({ imageUpload: null });
  const [uploadType, setUploadType] = useState("");
  const fileInputRef = useRef(null);
  const [showUpload, setshowUpload] = useState({ img: false, previews: false });
  const { handleChange } = Uploads({
    setUploads,
    setUploadType,
    setshowUpload,
  });
  const { showEmojiPicker1, setShowEmojiPicker1 } = useOpenZustand();

  const [messages, setMessages] = useState([]);
  const usernameRef = useRef("");
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const { setAnonomusChat } = useOpen();
  const [imogie, setImogie] = useState({});

  // 🔹 Generate Random Username on Load
  useEffect(() => {
    if (!usernameRef.current) {
      usernameRef.current = `Guest${Math.floor(Math.random() * 999)}`;
      setUsername(usernameRef.current);
    }
  }, []);

  // 🔹 Fetch Messages on Load
  useEffect(() => {
    const chatRef = ref(database, "chat/anonymousRoom/messages");

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.exists()
        ? Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];
      setMessages(data);
    });

    return () => unsubscribe(); // ✅ Ensures proper cleanup
  }, []);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // 🔹 Typing Indicator Logic
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    setTypingUser(username);
    setIsTyping(true);
    setTimeout(() => setTypingUser(""), 2000);
    setTimeout(() => setIsTyping(""), 3000);
  };

  // 🔹 Send Message or Image
  const sendMessage = async () => {
    if (!newMessage.trim() && !upload.imageUpload) return;

    const chatRef = ref(database, "chat/anonymousRoom/messages");
    const newMessage1 = {
      id: uuidv4(),
      username,
      message: newMessage,
      image: upload.imageUpload,
      timestamp: Date.now(),
    };

    await push(chatRef, newMessage1);
    setNewMessage("");
    setUploads({ imageUpload: null });
    setIsTyping(false);
  };

  return (
    <div className="h-[500px] flex flex-col max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg bg-white">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white py-1 px-4 rounded-t-lg">
        <div>
          <button
            onClick={() =>
              setAnonomusChat((prev) => ({ ...prev, showanonomus: false }))
            }
            className="flex items-center gap-2 cursor-pointer"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="bg-blue-600 text-white text-center py-3 font-bold text-lg">
          Anonymous Chat Room 🕵️
        </div>

        <div>
          <button
            className="cursor-pointer ml-2"
            onClick={() => {
              setAnonomusChat((prev) => ({
                ...prev,
                sleepanonomus: !prev?.sleepanonomus,
              }));
            }}
          >
            <ChevronDown className="h-6 w-6 text-white transition-transform" />
          </button>
        </div>
      </div>

      {/* 🔹 Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <MessagesBoxing
          messages={messages}
          imogie={imogie}
          setImogie={setImogie}
          username={username}
        />

        {/* 🔹 Typing Indicator */}
        {isTyping && (
          <div className="text-sm text-gray-500 italic text-left mt-2">
            🟡 {typingUser} is typing...
          </div>
        )}
      </div>

      {/* 🔹 Input Area */}
      <div className="flex items-center p-2 bg-white border-t border-gray-300 gap-2 relative">
        <Special
          setShowEmojiPicker={setShowEmojiPicker1}
          showEmojiPicker={showEmojiPicker1}
          setNewMessage={setNewMessage}
        />

        <FileUploading
          upload={upload.imageUpload}
          setUploads={setUploads}
          handleChange={handleChange}
          fileInputRef={fileInputRef}
          fileType={"image/*"}
          setshowUpload={setshowUpload}
          showUpload={showUpload}
          setUploadType={setUploadType}
          uploadType={uploadType}
        />

        {/* Message Input */}
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-400"
        />

        {/* 🚀 Send Button */}
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() && !upload?.imageUpload}
          className={`bg-blue-500 text-white px-4 py-2 rounded-full shadow-md 
            ${
              !newMessage.trim() && !upload?.imageUpload
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            } transition`}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default AnonymousChat;

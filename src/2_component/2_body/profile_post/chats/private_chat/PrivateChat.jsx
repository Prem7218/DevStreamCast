import React, { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiPlusCircle, FiSend } from "react-icons/fi";
import "../../../../../App.css";
import ChatTop from "../connection/ChatTop";
import { useOpen } from "../../../../../3_context/openContext";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { get, ref, update } from "firebase/database";
import { auth, database } from "../../../../../constantData/firebase";
import { FileUploading, Special } from "../Specials/Special";
import { Uploads } from "../Specials/Uploads";
import MessagesBoxing from "../Specials/MessagesBoxing";
import MessageActions from "./MessageActions";
import useMessageSelection from "../../../../../1_hooks/useMessageSelection";
import { useOpenZustand } from "../../../../../4_Zustand/useOpenZustand";

const PrivateChat = ({ userChatId }) => {
  const { id } = useParams();
  const loggedInUID = auth?.currentUser?.uid;
  const userId = id === undefined || !id ? userChatId : id;

  const [upload, setUploads] = useState({
    imageUpload: null,
    locationUpload: null,
    documentUpload: null,
    zipElseUpload: null,
  });
  const [showUpload, setshowUpload] = useState({ img: false, previews: false });
  const [uploadType, setUploadType] = useState("");
  const fileInputRef = useRef(null);
  const { handleChange } = Uploads({
    setUploads,
    setUploadType,
    setshowUpload,
  });
  const { showEmojiPicker2, setShowEmojiPicker2 } = useOpenZustand();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { setShowChat, setShowMap } = useOpen();
  const { selectedMessages, selectAllMessages, clearSelection } =
    useMessageSelection();
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("bg-gray-100");

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() && !upload?.imageUpload) return;

    try {
      const chatRef1 = ref(database, `chat/private/${loggedInUID}_${userId}`);
      const chatRef2 = ref(database, `chat/private/${userId}_${loggedInUID}`);

      const snapshot1 = await get(chatRef1);
      const snapshot2 = await get(chatRef2);

      let chatRef;
      let existingMessages = [];

      if (snapshot1.exists()) {
        chatRef = chatRef1;
        existingMessages = snapshot1.val().messages || [];
      } else if (snapshot2.exists()) {
        chatRef = chatRef2;
        existingMessages = snapshot2.val().messages || [];
      } else {
        chatRef = chatRef1;
      }

      // 🔹 New Message Object
      const newMsg = {
        messager: loggedInUID,
        senderId: loggedInUID,
        UserId: userId,
        image: upload?.imageUpload,
        location: upload?.locationUpload,
        document: upload?.documentUpload,
        zipElseUpload: upload?.zipElseUpload,
        message: newMessage,
        timestamp: Date.now(),
      };

      await update(chatRef, {
        messages: [...existingMessages, newMsg],
      });

      setMessages([...messages, newMsg]);
      setNewMessage("");
      setUploads({
        imageUpload: null,
        locationUpload: null,
        documentUpload: null,
        zipElseUpload: null,
      });
      setShowOptions(false);
      setshowUpload({ img: false, previews: false });
      console.log("✅ Message Sent Successfully!");
    } catch (error) {
      console.log("❌ Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!loggedInUID) return;

    const fetchMessages = async () => {
      try {
        const chatRef1 = ref(database, `chat/private/${loggedInUID}_${userId}`);
        const chatRef2 = ref(database, `chat/private/${userId}_${loggedInUID}`);

        const snapshot1 = await get(chatRef1);
        const snapshot2 = await get(chatRef2);

        if (snapshot1.exists()) {
          setMessages(snapshot1.val().messages || []);
        } else if (snapshot2.exists()) {
          setMessages(snapshot2.val().messages || []);
        } else {
          console.log("📭 No messages found.");
        }
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [loggedInUID, userId]);

  // 🔹 Theme Change Handler
  const changeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setShowMenu(false); // Close menu after changing theme
  };

  const copySelectedMessages = () => {
    const selectedText = messages
      .filter((msg) => selectedMessages[msg.id])
      .map((msg) => msg.message || "")
      .join("\n");

    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      alert("✅ Copied Selected Messages!");
    } else {
      alert("⚠️ No messages selected.");
    }

    clearSelection(); // Clear selection after copying
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUploads((prev) => ({
            ...prev,
            locationUpload: `${latitude},${longitude}`
          }));
        },
        (error) => {
          console.error("❌ Error fetching location:", error);
          alert("❌ Unable to fetch location. Please allow location access.");
        }
      );
    } else {
      alert("❌ Geolocation is not supported by this browser.");
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-[35%] flex flex-col h-[500px] max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg ${theme}`}
    >
      {/* 🔹 Top Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white py-3 px-4 rounded-t-lg">
        <ChatTop userId={userId} />

        <h2 className="font-semibold text-lg">Chat with User</h2>

        {/* 🔹 3-Dot Menu with Options */}
        <div className="relative flex">
          <button
            className="text-white cursor-pointer"
            onClick={() => {
              setShowOptions(false);
              setShowMenu(!showMenu);
            }}
          >
            <FiMoreVertical size={22} />
          </button>

          {showMenu && (
            <MessageActions
              messages={messages}
              selectAllMessages={selectAllMessages}
              selectedMessages={selectedMessages}
              copySelectedMessages={copySelectedMessages}
              changeTheme={changeTheme}
            />
          )}

          <div
            className="cursor-pointer ml-2"
            onClick={() => {
              setShowChat((prev) => ({ ...prev, sleepChat: !prev?.sleepChat }));
            }}
          >
            <ChevronDown className="h-6 w-6 text-white transition-transform" />
          </div>
        </div>
      </div>

      {/* 🔹 Messages Container */}
      <div className="flex-1 overflow-y-auto h-[500px] w-[100%] p-4 space-y-2">
        <MessagesBoxing
          messages={messages}
          username={loggedInUID}
          upload={upload?.locationUpload}
          setUploads={setUploads}
          classi="message-container"
        />
      </div>

      {/* 🔹 Bottom Input & Options */}
      <div className="flex items-center p-3 bg-white border-t border-gray-300 gap-2">
        <Special
          setShowEmojiPicker={setShowEmojiPicker2}
          showEmojiPicker={showEmojiPicker2}
          setNewMessage={setNewMessage}
        />

        {/* Message Input */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-400"
        />

        {/* ➕ Options Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowOptions(!showOptions);
              setShowMap(false);
              setShowMenu(false);
            }}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            <FiPlusCircle size={22} />
          </button>

          {showOptions && (
            <div className="absolute bottom-12 right-0 w-48 bg-white border border-gray-200 shadow-md rounded-lg z-50">
              <FileUploading
                upload={upload.imageUpload}
                setUploads={setUploads}
                handleChange={handleChange}
                fileInputRef={fileInputRef}
                privates={true}
                fileType={"image/*"}
                setshowUpload={setshowUpload}
                showUpload={showUpload}
                setUploadType={setUploadType}
                uploadType={uploadType}
              />

              <FileUploading
                upload={upload.locationUpload}
                setUploads={setUploads}
                handleChange={handleChange}
                privates={true}
                fileType={"location"}
                handleLocationShare={handleLocationShare}
                setshowUpload={setshowUpload}
                showUpload={showUpload}
                setNewMessage={setNewMessage}
              />

              <FileUploading
                upload={upload.documentUpload}
                setUploads={setUploads}
                handleChange={handleChange}
                privates={true}
                fileType={"application/pdf"}
                setshowUpload={setshowUpload}
                showUpload={showUpload}
              />

              <FileUploading
                upload={upload.zipElseUpload}
                setUploads={setUploads}
                handleChange={handleChange}
                privates={true}
                fileType={"application/zip"}
                setshowUpload={setshowUpload}
                showUpload={showUpload}
              />
            </div>
          )}
        </div>

        {/* 🚀 Send Button */}
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition cursor-pointer"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;

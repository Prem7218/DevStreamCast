import React, { useRef, useState, useEffect } from "react";
import PostTextArea from "./PostTextArea";
import MediaUploader from "./MediaUploader";
import MentionTaggingInput from "./MentionTaggingInput";
import PrivacySelector from "./PrivacySelector";
import { Special } from "../chats/Specials/Special";
import {
  deleteMediaFromFirebase,
  model,
} from "../../../../constantData/mock_data";
import { useOpenZustand } from "../../../../4_Zustand/useOpenZustand";
import { OpenContext, useOpen } from "../../../../3_context/openContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../../../Authentications/login/profileFetcher";
import { auth, database } from "../../../../constantData/firebase";
import { ref, get } from "firebase/database";
import PostPreview from "./PostPreview";
import { usePostUpdate } from "../../../../4_Zustand/usePostUpdate";

const CreatePostModal = ({ isOpen, onClose }) => {
  const loggedInUserUID = auth?.currentUser?.uid;
  const [text, setTexts] = useState("");
  const [mentions, setMentions] = useState([]);
  const { text1, privacy, mentions1, setMentions1, setText, setPrivacy } = usePostUpdate();
  const { mediaFiles, setMediaFiles } = useOpen();
  const [showPreview, setShowPreview] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [showAIActions, setShowAIActions] = useState(false);
  const { user, setUser } = useOpen();
  const userProfiles = useSelector((state) => state.profile.userProfiles);
  const dispatch = useDispatch();
  const [dele1, setDele1] = useState(false);

  useEffect(() => {
    // Fetch user profiles from Redux store
    if (userProfiles.length === 0) {
      dispatch(fetchProfiles());
    }

    // Check if the logged-in user's profile exists in Firebase
    const userRef = ref(database, `users/${loggedInUserUID}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUser(snapshot.val());
      } else {
        setUser(null);
      }
      setLoading1(false);
    });
  }, [loggedInUserUID, dispatch, userProfiles]);

  useEffect(() => {
    console.log("Media: ", mediaFiles.length);
  }, [mediaFiles.length]);

  const textareaRef = useRef(null);

  const setShowEmojiPicker3 = useOpenZustand(
    (state) => state.setShowEmojiPicker3
  );
  const showEmojiPicker3 = useOpenZustand((state) => state.showEmojiPicker3);

  const aiOptions = [
    { type: "professional", label: "✨ Make Professional" },
    { type: "summarize", label: "📄 Summarize" },
    { type: "sudo", label: "🧠 Generate Sudo-Code" },
    { type: "format", label: "🛠 Fix Formatting" },
    { type: "custom", label: "➕ Custom Prompt" },
  ];

  const handleAIAction = async (type) => {
    if (!text.trim()) return;

    setLoading(true);
    setShowAIActions(false);

    let prompt = "";
    switch (type) {
      case "professional":
        prompt = `Rewrite the following to sound professional:\n\n"${text}"`;
        break;
      case "summarize":
        prompt = `Summarize this content:\n\n"${text}"`;
        break;
      case "sudo":
        prompt = `Convert this to sudo-code:\n\n"${text}"`;
        break;
      case "format":
        prompt = `Fix formatting and grammar:\n\n"${text}"`;
        break;
      case "custom":
        prompt = `Enhance this text in a useful way:\n\n"${text}"`;
        break;
    }

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setTexts(response);
      setText(response);
    } catch (error) {
      console.log("Gemini AI error:", error);
      alert("AI processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = async (index, fileId) => {
    setDele1(false);
    await deleteFromCloudinary(fileId);

    if (dele1) {
      const updatedFiles = [...mediaFiles];
      updatedFiles.splice(index, 1);
      setMediaFiles(updatedFiles);
    }
  };

  const deleteFromCloudinary = async (publicId) => {
    try {
      const res = await fetch("http://localhost:5000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      const result = await res.json();

      if (result.success) {
        const dele = await deleteMediaFromFirebase(publicId);
        console.log("DELETE RESULT:", result, "\nFirebase: ", dele);
        alert("File deleted successfully!");
        setDele1(true);
      } else {
        alert("Delete failed: " + (result.error || "Unknown reason"));
      }
    } catch (error) {
      console.log("Fetch error:", error);
      alert("Network or Server error during deletion.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 grid gap-5 items-center justify-center grid-cols-1 z-50">
      <div className="modal-content bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create a Post</h2>
          <button
            onClick={() => {
              setShowEmojiPicker3(false);
              onClose();
              setShowAIActions(false);
              setShowPreview(false);
              setMediaFiles([]);
              setMentions([]);
              setMentions1([]);
              setTexts("");
              setText("");
              onClose();
            }}
            className="text-gray-500 hover:text-red-500 transition text-sm cursor-pointer"
          >
            Close
          </button>
        </div>

        <PostTextArea
          setShowPreview={setShowPreview}
          value={text}
          onChange={setTexts}
          setText={setText}
          loading={loading}
          onCursorChange={setCursorPos}
          inputRef={textareaRef}
          text1={text1}
        />

        <MentionTaggingInput
          mentions={mentions}
          mentions1={mentions1}
          setMentions={setMentions}
          setMentions1={setMentions1}
          text={text}
          cursorPos={cursorPos}
          setTextExternally={setTexts}
          setText={setText}
          connections={user?.connections || []}
        />

        <div className="flex justify-between items-center">
          <Special
            setShowEmojiPicker={setShowEmojiPicker3}
            showEmojiPicker={showEmojiPicker3}
            setNewMessage={setTexts}
            inCreatePost={true}
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAIActions(!showAIActions)}
              className="px-3 py-2 text-sm bg-green-100 text-black rounded hover:bg-green-200 cursor-pointer"
            >
              🤖 AI Tools
            </button>
            {showAIActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded z-10">
                {aiOptions.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => handleAIAction(type)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <MediaUploader files={mediaFiles} setFiles={setMediaFiles} />
        <PrivacySelector value={privacy} onChange={setPrivacy} />

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => {
              setShowEmojiPicker3(false);
              onClose();
              setShowAIActions(false);
              setShowPreview(false);
              setMediaFiles([]);
              setMentions([]);
              setMentions1([]);
              setTexts("");
              setText("")
              onClose();
            }}
            className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out"
          >
            Cancel
          </button>
          <button
            disabled={text.trim().length === 0 && text1.trim().length === 0}
            onClick={() => setShowPreview(!showPreview)}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none transition duration-400 ease-in-out ${
              text.trim().length === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            }`}
          >
            {showPreview ? "Close Preview" : "Preview"}
          </button>
        </div>
      </div>

      {showPreview && (
        <div
          className={`modal-content max-w-lg z-50 rounded-lg transition-all duration-300 ease-in-out transform`}
        >
          <PostPreview
            setShowPreview={setShowPreview}
            setText={setTexts}
            setTexts={setText}
            setMediaFiles={setMediaFiles}
            setMentions={setMentions}
            setMentions1={setMentions1}
            setShowEmojiPicker3={setShowEmojiPicker3}
            setShowAIActions={setShowAIActions}
            onClose={onClose}
            text={text}
            mentions={mentions}
            mediaFiles={mediaFiles}
            privacy={privacy}
            onRemoveFile={handleRemoveFile}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;

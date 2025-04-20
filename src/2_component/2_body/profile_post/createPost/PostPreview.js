import React, { useEffect, useState } from "react";
import { ref, push } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { auth, database } from "../../../../constantData/firebase";
import { useOpenZustand } from "../../../../4_Zustand/useOpenZustand";

const PostPreview = ({
  text,
  mentions,
  mediaFiles,
  privacy,
  onRemoveFile,
  setMediaFiles,
  setMentions,
  setShowAIActions,
  setShowEmojiPicker3,
  onClose,
  setText,
  setShowPreview,
}) => {
  const loggedInUserUID = auth?.currentUser?.uid;

  useEffect(() => {
    if (!loggedInUserUID) return;
  }, []);

  const post_username = useOpenZustand((state) => state.post_username);
  const post_Profile = useOpenZustand((state) => state.post_Profile);

  const handlePost = async () => {
    try {
      const id = uuidv4();
      console.log("fireMedia: ", mediaFiles);

      const newPost = {
        id,
        user: post_username,
        profile: post_Profile,
        text,
        privacy,
        createdAt: Date.now(),
        likes: 0,
        shares: 0,
        comments: [],
      };

      const newUpload = {
        userId: loggedInUserUID,
        id,
        media: mediaFiles,
        mentions
      }

      const postsRef = ref(database, `users/${loggedInUserUID}/posts`);
      const medRef = ref(database, `postMedia`);

      await push(postsRef, newPost);
      await push(medRef, newUpload);

      console.log("✅ New post added to Firebase!");

      // Reset UI
      setMediaFiles([]);
      setMentions([]);
      setShowAIActions(false);
      setShowEmojiPicker3(false);
      setShowPreview(false);
      setText("");
      onClose();
    } catch (error) {
      console.log("❌ Error saving post:", error);
    }
  };

  return (
    <div className="w-full p-6 border border-gray-200 rounded-xl shadow-sm transition-all duration-300">
      <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
        🔍 Post Preview
      </h3>

      {/* Post Text */}
      <div className="max-h-60 overflow-y-auto">
        <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
          {text}
        </p>
      </div>

      {/* Mentions */}
      {/* {mentions?.length > 0 && (
        <div className="mt-3 text-sm text-blue-600">
          <strong className="text-gray-700">Mentions:</strong>{" "}
          {mentions.map((m) => `@${m}`).join(", ")}
        </div>
      )} */}

      {/* Media Preview */}
      {mediaFiles?.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-2">
            {mediaFiles.map((file, i) => {
              const src =
                typeof file === "string"
                  ? file
                  : file.url || URL.createObjectURL(file);
              const type =
                file?.type ||
                (file?.url?.includes(".mp4") ? "video/mp4" : "image");

              return (
                <div
                  key={i}
                  className="relative group min-w-[250px] max-w-[300px] h-[100px] rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow duration-300"
                >
                  {type.startsWith("image") ? (
                    <img
                      src={src}
                      alt={`media-${i}`}
                      className="w-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      controls
                      className="rounded-md object-cover w-full"
                    >
                      <source src={file.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveFile(i, file.public_id)}
                    title="Remove media"
                    className="absolute top-1.5 right-1.5 w-6 h-6 text-sm text-white bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy Info */}
      <div className="mt-4 text-sm text-gray-500">
        <strong>Privacy:</strong> <span className="capitalize">{privacy}</span>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handlePost}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none transition duration-400 ease-in-out cursor-pointer"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostPreview;

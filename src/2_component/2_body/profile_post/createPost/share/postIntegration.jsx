import React, { useEffect, useState } from "react";
import Share from "./Share";
import { database } from "../../../../../constantData/firebase";
import { get, ref, update } from "firebase/database";
import { Special } from "../../chats/Specials/Special";

const PostInteraction = ({ post, loggedInUserId }) => {
  const [shareCheck, setShareCheck] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);
  const [localShares, setLocalShares] = useState(post.shares || 0);
  const [localComment, setLocalComment] = useState(post.comments?.length || 0);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker4, setShowEmojiPicker4] = useState(false);

  const handleInteraction = async (type) => {
    const postsRef = ref(database, `users/${loggedInUserId}/posts`);

    try {
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const postsData = snapshot.val();

        const matchedPostKey = Object.keys(postsData).find(
          (key) => postsData[key].id === post.id
        );

        if (matchedPostKey) {
          const matchedPostRef = ref(
            database,
            `users/${loggedInUserId}/posts/${matchedPostKey}`
          );

          const currentCount = postsData[matchedPostKey][type] || 0;

          await update(matchedPostRef, {
            [type]: currentCount > 0 ? currentCount - 1 : currentCount + 1,
          });

          if (type === "likes") {
            if (currentCount > 0) {
              setLocalLikes((prev) => prev - 1);
            } else {
              setLocalLikes((prev) => prev + 1);
            }
          } else if (type === "shares") {
            setLocalShares((prev) => prev + 1);
          }
        } else {
          console.log("Post not found!");
        }
      } else {
        console.log("No posts available!");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleComment = async () => {
    const postsRef = ref(database, `users/${loggedInUserId}/posts`);

    try {
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const postsData = snapshot.val();

        const matchedPostKey = Object.keys(postsData).find(
          (key) => postsData[key].id === post.id
        );

        if (matchedPostKey) {
          const matchedPostRef = ref(
            database,
            `users/${loggedInUserId}/posts/${matchedPostKey}/comments`
          );

          // Fetch current comments array or empty array
          const currentComments = postsData[matchedPostKey].comments || [];

          const newComment = {
            text: newMessage,
            timestamp: new Date().toISOString(), // Optional: Save time
            userId: loggedInUserId,
          };

          // Update comments array
          await update(
            ref(database, `users/${loggedInUserId}/posts/${matchedPostKey}`),
            {
              comments: [...currentComments, newComment],
            }
          );

          console.log("Comment added successfully!");

          // Optional: Clear the input after posting
          setLocalComment((prev) => prev + 1);
          setNewMessage("");
        } else {
          console.log("Post not found!");
        }
      } else {
        console.log("No posts available!");
      }
    } catch (e) {
      console.log("Error:", e);
    }
  };

  return (
    <div>
      <div className="flex gap-6 text-gray-500 text-sm mt-4 items-center">
        <span
          onClick={() => {
            handleInteraction("likes");
          }}
          className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
        >
          👍 {localLikes} Likes
        </span>

        <div className="flex items-center gap-2 hover:text-blue-600">
          <button
            onClick={() => setShareCheck(!shareCheck)}
            aria-label="Share Post"
            className="cursor-pointer"
          >
            🔁 {localShares}
            {shareCheck && (
              <Share
                handleInteraction={handleInteraction}
                description="Check out this awesome page!"
              />
            )}
          </button>
        </div>

        <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
          💬 {localComment} Comments
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            className="w-full mt-3 p-2 border-none rounded-md focus:outline-none"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            type="text"
            placeholder="Add a Comment..."
          />
        </div>

        <div className="mt-3 flex gap-1">
          {newMessage.length > 0 && (
            <div>
              <button
                onClick={handleComment}
                className="text-blue-500 p-2 cursor-pointer"
              >
                post
              </button>
            </div>
          )}
          <div>
            <Special
              setShowEmojiPicker={setShowEmojiPicker4}
              showEmojiPicker={showEmojiPicker4}
              setNewMessage={setNewMessage}
              postme={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;

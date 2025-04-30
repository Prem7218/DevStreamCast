import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOpenZustand } from "../../../../../4_Zustand/useOpenZustand";
import { useNavigate } from "react-router-dom";
import PostCardShimmer from "./PostCardShimmer";
import { onValue, ref } from "firebase/database";
import { auth, database } from "../../../../../constantData/firebase";
import { usePostUpdate } from "../../../../../4_Zustand/usePostUpdate";
import { useOpen } from "../../../../../3_context/openContext";
import PostOptions from "./postFeedOption";
import PostInteraction from "../share/postIntegration";

const PostFeed = ({ isProfile, isBody }) => {
  const puids = usePostUpdate((state) => state.puids);
  const loggedInUserId = puids;
  const posts = useSelector((store) =>
    isBody ? store.posts.allPosts : store.posts.currentUserPost
  );
  const [mediaMap, setMediaMap] = useState([]);
  const [userIds, setUserIds] = useState({});

  useEffect(() => {
    if (!loggedInUserId) return;

    const mediaRef = ref(database, "postMedia");

    const unsubscribe = onValue(mediaRef, (snapshot) => {
      const data = snapshot.val() || {};
      let filtered;

      if (isBody) {
        filtered = Object.keys(data).reduce((acc, userId) => {
          const userPosts = data[userId];

          if (userPosts && Array.isArray(userPosts.media)) {
            userPosts.media.forEach((entry) => {
              const postId = userPosts.id;

              if (!acc[postId]) {
                acc[postId] = [];
              }

              acc[postId].push(entry);
              setUserIds((prev) => ({
                ...prev,
                [postId]: userPosts?.userId,
              }));
            });
          }

          return acc;
        }, {});
      } else {
        filtered = Object.values(data)
          .filter((entry) => entry.userId === loggedInUserId)
          .reduce((acc, entry) => {
            acc[entry.id] = entry.media || [];
            return acc;
          }, {});
      }

      setMediaMap(filtered);
    });

    return () => unsubscribe();
  }, [loggedInUserId]);

  const findMediaByPostId = (postId) => {
    return mediaMap[postId] || [];
  };

  const logIdByPostId = (postId) => {
    return userIds[postId] || [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {!isProfile && <h2 className="text-2xl font-bold mb-6">📰 Your Feed</h2>}
      {posts.length === 0 ? (
        <>
          <p className="text-gray-500 text-center">No posts yet.</p>
        </>
      ) : (
        <>
          {!isProfile ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isProfile={isProfile}
                postMedia={findMediaByPostId(post.id)}
                mediaman={mediaMap[post.id]}
                loggedInUserId={logIdByPostId(post.id)}
              />
            ))
          ) : (
            <PostCard
              key={posts[0].id}
              post={posts[0]}
              isProfile={isProfile}
              postMedia={findMediaByPostId(posts[0].id)}
              mediaman={mediaMap[posts[0].id]}
              loggedInUserId={logIdByPostId(posts[0].id)}
            />
          )}
        </>
      )}
    </div>
  );
};

const PostCard = ({
  post,
  isProfile,
  postMedia = [],
  mediaman,
  loggedInUserId,
}) => {
  const setPage = useOpenZustand((state) => state.setPage);
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);
  const MAX_CHARS = 300;
  const [loading, setLoading] = useState(true);
  const [shareCheck, setShareCheck] = useState(false);
  const { setText, setMentions1 } = usePostUpdate();
  const { setMediaFiles } = useOpen();
  const setOpen1 = useOpenZustand((state) => state.setOpen1);
  const setOpen = useOpenZustand((state) => state.setOpen);

  const toggleText = () => setShowFullText((prev) => !prev);

  const displayedText =
    !showFullText && post.text.length > MAX_CHARS
      ? post.text.slice(0, MAX_CHARS) + "..."
      : post.text;

  useEffect(() => {
    const timeup = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeup);
  }, [loading]);

  if (loading) {
    return (
      <div className="w-full">
        <PostCardShimmer />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-2">
      {/* Mock Header */}
      <div className="flex justify-between items-start mb-3">
        {/* LEFT SIDE - Avatar + Name & Time */}
        <div className="flex gap-3">
          {post?.profile ? (
            <img
              onClick={() => navigate(`/profile/${loggedInUserId}`)}
              src={post.profile}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          )}

          <div className="flex flex-col justify-center">
            <p
              onClick={() => navigate(`/profile/${loggedInUserId}`)}
              className="font-semibold text-gray-800 leading-snug cursor-pointer"
            >
              👤 {post.user || "New User"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight">
              {post.createdAt && new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - 3 Dot Menu */}
        <div>
          <PostOptions
            setMentions1={setMentions1}
            setText={setText}
            setMediaFiles={setMediaFiles}
            setOpen={setOpen}
            setOpen1={setOpen1}
            displayedText={post.text}
            mediaman={postMedia}
            isProfile={isProfile}
            mentions={postMedia?.mentions}
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">
        {displayedText}
        {post.text.length > MAX_CHARS && (
          <button
            onClick={toggleText}
            className="ml-2 text-blue-500 hover:underline text-sm"
          >
            {showFullText ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      {/* {console.log("POSTMEDIA: ", postMedia)} */}
      {/* Media Preview */}
      {postMedia.length > 0 && (
        <div className="flex overflow-x-auto space-x-4 mt-4 pb-2">
          {postMedia.map((file, index) => {
            if (file.type?.startsWith("image")) {
              return (
                <img
                  key={index}
                  src={file.url}
                  alt={file.name || "media"}
                  className="rounded-md max-h-60 object-cover w-60 flex-shrink-0"
                />
              );
            } else if (file.type?.startsWith("video")) {
              return (
                <video
                  key={index}
                  controls
                  className="rounded-md max-h-60 object-cover w-60 flex-shrink-0"
                >
                  <source src={file.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              );
            } else {
              return (
                <p
                  key={index}
                  className="text-sm text-gray-400 flex-shrink-0 w-60 border border-dashed rounded-md p-4"
                >
                  📎 {file.name || file.path || "Media file"}
                </p>
              );
            }
          })}
        </div>
      )}

      {postMedia?.mentions?.length > 0 && (
        <div className="mt-3 text-sm text-blue-600 min-w-max">
          <strong className="text-gray-700 bg-blue-300 px-2 py-1 rounded mr-2">
            Mentions:
          </strong>
          {postMedia?.mentions.map((m) => (
            <span key={m} className="mr-2">
              @{m}
            </span>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <PostInteraction post={post} loggedInUserId={loggedInUserId} />

      {isProfile && (
        <div className="flex justify-end text-black">
          <p
            onClick={() => {
              setPage("G_Post");
              navigate("/");
            }}
            className="text-blue-600 cursor-pointer"
          >
            More...
          </p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;

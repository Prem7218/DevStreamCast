import React from "react";
import { useOpen } from "../../../../../3_context/openContext";
import { Link } from "react-router-dom";

const Connection = ({ connections, setConnListOpen, body, setUserChatId }) => {
  const { setShowChat } = useOpen();

  return (
    <div className={`overflow-y-auto p-4 flex-grow`}>
      {connections && Object.keys(connections).length > 0 ? (
        <ul className="gap-2">
          {Object.values(connections).map((profile) => (
            <Link
            key={profile?.uid}
              to={`${body ? `/` : `/profile/${profile?.uid}`}`}
              onClick={() => {
                setConnListOpen(false)
                if(body) {
                  setUserChatId(profile?.uid)
                  setShowChat((prev) => ({
                    ...prev,
                    showChat: true,
                    sleepChat: false // 🔹 Ensure `sleepChat` is reset when opening chat
                  }));
                }
              }}
            >
              <li
                key={profile.uid}
                className="flex items-center gap-3 border-b pb-2"
              >
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-gray-500">{profile.title || "No Title"}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No connections found.</p>
      )}
    </div>
  );
};

export default Connection;

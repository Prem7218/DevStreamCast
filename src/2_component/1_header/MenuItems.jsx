import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { menuItem, menuItems1 } from "../../constantData/url_icons";
import { useSelector } from "react-redux";
import useVoiceCommands from "../../1_hooks/useVoiceCommand";

const MenuItems = ({ isLogin, setLogin, menu }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(true);
  const { startListening, stopListening } = useVoiceCommands(navigate, setIsListening);
  const meetNow = useSelector((store) => store.meetNow);
  const firstMeetingURL = meetNow?.meetingLink || null;

  const handleLoginToggle = () => {
    setLogin((prev) => !prev);
  };

  const handleMeeting = () => {
    if (firstMeetingURL) {
      console.log("Already Meeting Exist: ", firstMeetingURL);
      navigate(firstMeetingURL);
    } else {
      navigate(`/meetnow`);
    }
  };

  const handleListen = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="flex items-center gap-x-2 w-full">
      <div>
        <button
          className={`"flex items-center space-x-2 px-4 py-2 rounded-md bg-white shadow-md hover:bg-blue-200 transition w-full cursor-pointer"
                    ${
                      !isListening
                        ? "bg-blue-500 text-white hover:bg-blue-700"
                        : "bg-red-500 text-white"
                    }
                `}
          onClick={handleListen}
        >
          <span className="text-gray-900 font-semibold">
            {isListening ? (
              <div className="flex gap-1">
                <div>🎙</div>
                <div>AutoDev</div>
              </div>
            ) : (
              <div className="flex gap-1">
                <div>🛑</div>
                <div>AutoDev</div>
              </div>
            )}
          </span>
        </button>
      </div>

      {/* 🏠 Home Button */}
      <Link to="/" className="flex-grow">
        <button className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white shadow-md hover:bg-blue-200 transition w-full cursor-pointer">
          <Home className="text-blue-500" />
          <span className="text-gray-900 font-semibold">Home</span>
        </button>
      </Link>
      {/* ℹ️ About Button */}
      <button className="flex-grow flex items-center space-x-2 px-4 py-2 rounded-md bg-white shadow-md hover:bg-green-100 transition cursor-pointer">
        <span className="text-green-500">{menuItem[0].icon}</span>
        <span className="text-gray-800 font-medium">{menuItem[0].name}</span>
      </button>
      {/* 🔹 Logged-in User Menu Items */}
      {isLogin && (
        <>
          <button
            key={19}
            className="flex-grow flex items-center space-x-2 px-4 py-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition cursor-pointer"
          >
            <span className="text-blue-500">{menuItems1[0].icon}</span>
            <span className="text-gray-800 font-medium">
              {menuItems1[0].name}
            </span>
          </button>

          <button
            onClick={handleMeeting}
            className="flex-grow flex items-center space-x-2 px-4 py-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition cursor-pointer"
          >
            <span className="text-blue-500">{menuItems1[1].icon}</span>
            <span className="text-gray-800 font-medium">DevMeet</span>
          </button>
        </>
      )}
      {/* 👤 Account / Authentication Button */}
      <Link to={"/authentication/1"} className="flex-grow">
        <button
          onClick={handleLoginToggle}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md w-full cursor-pointer"
        >
          {menu[0].icon}
          <span>{menu[0].name}</span>
        </button>
      </Link>
    </div>
  );
};

export default MenuItems;

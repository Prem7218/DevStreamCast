import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { menuItem, menuItems1 } from "../../constantData/url_icons";
import { useSelector } from "react-redux";

const MenuItems = ({ isLogin, setLogin, menu }) => {
  const navigate = useNavigate();
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

  return (
    <>
      <div className="flex gap-2 w-full">
        {/* 🔹 Logged-in User Menu Items */}
        {isLogin && (
          <>
            <button
              key={19}
              className="flex-grow flex items-center space-x-2 px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition duration-300 cursor-pointer"
            >
              <span className="text-blue-500">{menuItems1[0].icon}</span>
              <span className="text-gray-800 font-medium">
                {menuItems1[0].name}
              </span>
            </button>

            <button
              onClick={handleMeeting}
              className="flex-grow flex items-center space-x-2 px-3 py-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition duration-300 cursor-pointer"
            >
              <span className="text-blue-500">{menuItems1[1].icon}</span>
              <span className="text-gray-800 font-medium">DevMeet</span>
            </button>
          </>
        )}

        {/* 🔹 Home Button */}
        <Link key={8} to={"/"} className="flex-grow">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-white shadow-md hover:bg-blue-200 transition duration-300 w-full cursor-pointer">
            <span className="text-blue-500">
              <Home />
            </span>
            <span className="text-gray-900 font-semibold">{"Home"}</span>
          </button>
        </Link>

        {/* 🔹 Main Menu Items */}
        <button className="flex-grow flex items-center space-x-2 px-3 py-2 rounded-md bg-white shadow-sm hover:bg-green-100 transition duration-300 cursor-pointer">
          <span className="text-green-500">{menuItem[0].icon}</span>
          <span className="text-gray-800 font-medium">{menuItem[0].name}</span>
        </button>

        {/* 🔹 Login/Logout Button */}
        <Link key={9} to={"/authentication/1"} className="flex-grow">
          <button
            onClick={handleLoginToggle}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-300 shadow-md w-full cursor-pointer"
          >
            <span>{menu[0].icon}</span>
            <span>{menu[0].name}</span>
          </button>
        </Link>
      </div>
    </>
  );
};

export default MenuItems;

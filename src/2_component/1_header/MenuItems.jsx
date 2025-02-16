import React from "react";
import { menuItem, menuItems1 } from "../../constantData/url_icons";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "../../constantData/url_icons";

const MenuItems = ({ isLogin, setLogin, menu }) => {
  const navigate = useNavigate();
  const handleLoginToggle = () => {
    setLogin((prev) => !prev);
  };

  const handleMeeting = () => {
    navigate("/meetnow");
  }

  return (
    <div className="p-4 bg-gradient-to-br rounded-lg shadow-lg">
      <div className="flex justify-center items-center gap-2">
        {/* Logged-in User Menu Items */}
        {isLogin && (
          <>
            <button
              key={19}
              href="#"
              className="flex items-center space-x-2 p-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition duration-300"
            >
              <span className="text-blue-500">{menuItems1[0].icon}</span>
              <span className="text-gray-800 font-medium">{menuItems1[0].name}</span>
            </button>

            <button
              key={18}
              onClick={handleMeeting}
              href="#"
              className="flex items-center space-x-2 p-2 rounded-md bg-white shadow-sm hover:bg-blue-100 transition duration-300"
            >
              <span className="text-blue-500">{menuItems1[1].icon}</span>
              <span className="text-gray-800 font-medium">{menuItems1[1].name}</span>
            </button>
          </>
        )}

        {/* Home Button */}
        <Link key={8} to={"/"}>
          <button className="flex items-center space-x-2 p-2 rounded-md bg-white shadow-md hover:bg-blue-200 transition duration-300">
            <span className="text-blue-500">{Home[0].icon}</span>
            <span className="text-gray-900 font-semibold">{Home[0].name}</span>
          </button>
        </Link>

        {/* Main Menu Items */}
        {menuItem.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center space-x-2 p-2 rounded-md bg-white shadow-sm hover:bg-green-100 transition duration-300"
          >
            <span className="text-green-500">{item.icon}</span>
            <span className="text-gray-800 font-medium">{item.name}</span>
          </a>
        ))}

        {/* Login/Logout Button */}
        <Link key={9} to={"/authentication/1"}>
          <button
            onClick={handleLoginToggle}
            className="flex items-center space-x-2 p-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <span>{menu[0].icon}</span>
            <span>{menu[0].name}</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MenuItems;

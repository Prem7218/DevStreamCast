import React, { useState } from "react";
import { User, Globe } from "lucide-react";
import { btn } from "../../constantData/url_icons";
import Search from "./Search";
import MenuItems from "./menuItems";
import "../../App.css";
import { useauthCheck } from "../../3_context/authContext";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isLogin, setLogin } = useauthCheck();
  const menu = [{ name: isLogin ? "Logout" : "Account", icon: <User /> }];

  return (
    <header className="bg-gradient-to-r from-slate-800 to-blue-400 p-4 shadow-lg text-white w-full">
      <div className="flex items-center justify-between max-w-full mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div className="bg-white text-blue-600 rounded-full p-2">
            <Globe className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">DevStreamCast</h1>
        </div>

        {/* Search Bar */}
        <div className="w-full checkCorrect">
          <div className="relative left-[15%] hidden sm:flex justify-between items-center bg-white rounded-lg px-3 py-2 w-[70%]">
            <Search
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              isMenuOpen={isMenuOpen}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6">
          <MenuItems isLogin={isLogin} setLogin={setLogin} menu={menu} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {btn}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b mt-3 from-slate-800 to-blue-400 p-4 space-y-4 animate-slide-down">
          {/* Mobile Search Bar */}
          <div className="checkCorrect flex items-center bg-white rounded-lg px-3 py-2">
            <Search
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              isMenuOpen={isMenuOpen}
            />
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex flex-col space-y-4">
            <MenuItems isLogin={isLogin} setLogin={setLogin} menu={menu} />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

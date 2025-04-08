import React, { useRef } from "react";
import { useOpen } from "../../3_context/openContext";
import { useauthCheck } from "../../3_context/authContext";
import "../../App.css";
import { Globe, User } from "lucide-react";
import Searchs from "./Search";
import MenuItems from "./menuItems";
import { btn } from "../../constantData/url_icons";

const Header = () => {
  const { isMenuOpen, setMenuOpen, searchTerm, setSearchTerm } = useOpen();
  const { isLogin, setLogin } = useauthCheck();
  const menu = [{ name: isLogin ? "Logout" : "Account", icon: <User /> }];
  const mobileSearchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  return (
    <header className="bg-gradient-to-r from-slate-800 to-blue-400 p-4 shadow-lg text-white w-full">
      <div className="flex justify-between max-w-full mx-auto">
        {/* Logo Section */}
        <div className="flex space-x-2">
          <div className="bg-white text-blue-600 rounded-full p-1 h-10">
            <Globe className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">DevStreamCast</h1>
        </div>

        {/* Search Bar */}
        <div className="w-full checkCorrect">
          <div
            ref={desktopSearchRef}
            className="relative left-[15%] hidden sm:flex justify-between items-center bg-white rounded-lg px-3 py-2 w-[70%]"
          >
            <Searchs
              headMe={true}
              isLogin={isLogin}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              isMenuOpen={isMenuOpen}
              inHeader={true}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex">
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

      <div className="md:hidden bg-gradient-to-b mt-2 from-slate-800 to-blue-400 animate-slide-down rounded-lg">
        {/* Mobile Search Bar */}
        <div ref={mobileSearchRef} className={`flex bg-white rounded-lg p-2 mt-2`}>
          <Searchs
            headMe={true}
            isLogin={isLogin}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            isMenuOpen={isMenuOpen}
          />
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b mt-3 from-slate-800 to-blue-400 p-1 rounded-md animate-slide-down">
          {/* Mobile Menu Items */}
          <nav className="flex flex-col overflow-x-auto removeScrollX">
            <MenuItems isLogin={isLogin} setLogin={setLogin} menu={menu} />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

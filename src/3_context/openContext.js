import { createContext, useContext, useState } from "react";

export const OpenContext = createContext();

export const OpenProvider = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [ConnListOpen, setConnListOpen] = useState(false);
  const [showChat, setShowChat] = useState({
    showChat: false,
    sleepChat: false,
  });
  const [anonomusChat, setAnonomusChat] = useState({
    showanonomus: false,
    sleepanonomus: false,
  });
  const [showMap, setShowMap] = useState(false);

  return (
    <OpenContext.Provider
      value={{
        isMenuOpen,
        setMenuOpen,
        searchTerm,
        setSearchTerm,
        user,
        setUser,
        ConnListOpen,
        setConnListOpen,
        showChat,
        setShowChat,
        anonomusChat,
        setAnonomusChat,
        showMap,
        setShowMap,
      }}
    >
      {children}
    </OpenContext.Provider>
  );
};

export const useOpen = () => useContext(OpenContext);

import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        isModalOpen,
        setModalOpen,
        isLogin,
        setLogin,
        name,
        setName,
        email,
        setEmail,
        isSignUp,
        setIsSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useauthCheck = () => useContext(AuthContext);

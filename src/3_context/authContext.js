import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLogin, setLogin] = useState(false);

    return (
        <AuthContext.Provider value={{isModalOpen, setModalOpen, isLogin, setLogin}}>
            { children }
        </AuthContext.Provider>
    );
}

export const useauthCheck = () => useContext(AuthContext);
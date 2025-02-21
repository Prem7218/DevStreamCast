import { createContext, useContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [searchIndex, setSearchIndex] = useState(0);
  const [perPage, setPerPage] = useState(15);

  return (
    <LoadingContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        perPage,
        setPerPage,
        searchIndex,
        setSearchIndex,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface PageContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void; // Function to update currentPage
}

// Create the context with a default value of undefined
const PageContext = createContext<PageContextType | undefined>(undefined);

// Define the provider component
interface PageProviderProps {
  children: ReactNode; // Children can be any valid React node
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(2); // Default value

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

// Custom hook to use the PageContext
export const usePage = (): PageContextType => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};

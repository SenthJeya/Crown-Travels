// UserContext.js
import React, { createContext, useState } from 'react';

// Create a Context
export const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

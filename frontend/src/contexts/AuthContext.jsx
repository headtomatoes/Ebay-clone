import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { id, username, email, roles }

// Check if user has a specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  // Login function: saves token and user info to state and localStorage
  const login = (token, userData) => {
    setIsAuthenticated(true);
    setToken(token);
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      roles: userData.roles || []
    });

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  // Logout function: clears session from state and localStorage
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // Auto-login on page refresh: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

// Provide context values to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context in components
export const useAuth = () => useContext(AuthContext);

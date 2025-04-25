import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // { id, username, email, roles }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

// Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

// Check if user has a specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role)|| false;
  };

  // Login function: saves token and user info to state and localStorage
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function: clears session from state and localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };



  // Auto-login on page refresh: restore session from localStorage
//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     const storedUser = localStorage.getItem("authUser");
//
//     if (storedToken && storedUser) {
//       setIsAuthenticated(true);
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//     }
//
//     setLoading(false);
//   }, []);

// Provide context values to children components
  return (
      <AuthContext.Provider
          value={{
            isAuthenticated,
            user,
            token,
            login,
            logout,
            hasRole,
            loading
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

// Custom hook to use the auth context in components
// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    console.log("AuthContext: Checking localStorage...");
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
          try {
              const parsedUser = JSON.parse(storedUser);
              console.log("AuthContext: Found token and user in localStorage.", parsedUser);
              setToken(storedToken);
              setUser(parsedUser);
              setIsAuthenticated(true);
              // Optional: Set token for axios immediately if found.
              // Consider adding validation here (e.g., decode token, check expiration)
              // before blindly trusting localStorage and setting the header.
              // For simplicity now, we'll rely on login setting it.
              // setAuthToken(storedToken);
          } catch (error) {
              console.error("AuthContext: Error parsing user from localStorage", error);
              // Clear invalid data if parsing fails
              localStorage.removeItem('token');
              localStorage.removeItem('user');
          }
      } else {
          console.log("AuthContext: No token/user found in localStorage.");
      }

      console.log("AuthContext: Initial load check complete.");
      setLoading(false); // IMPORTANT: Set loading to false after checking
  }, []); // Empty dependency array ensures this runs only once on mount

// Check if user has a specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role)|| false;
  };

  // Login function: saves token and user info to state and localStorage
  const login = (newToken, userData) => {
    console.log("AuthContext: login called", userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function: clears session from state and localStorage
  const logout = () => {
      console.log("AuthContext: logout called");
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      // Also clear the auth token from axios headers
      // import { setAuthToken } from '../services/AuthService'; // Import if needed
      // setAuthToken(null); // Clear header on logout
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

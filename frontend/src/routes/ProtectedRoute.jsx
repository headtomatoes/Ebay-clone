import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Basic protected route - checks if user is authenticated
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Role-based protected route - checks if user has required role
export const RoleBasedRoute = ({ requiredRole }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Check both authentication and role
  return (isAuthenticated && hasRole(requiredRole))
      ? <Outlet />
      : isAuthenticated
          ? <Navigate to="/unauthorized" /> // User is logged in but doesn't have required role
          : <Navigate to="/login" />; // User is not logged in
};
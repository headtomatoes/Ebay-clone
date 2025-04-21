import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A reusable component that protects private routes.
 * If the user is not authenticated, they are redirected to the login page.
 * If authentication state is still loading, show loading screen.
 * Otherwise, the child components will be rendered.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while restoring session
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}

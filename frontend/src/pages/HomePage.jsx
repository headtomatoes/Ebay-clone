import React from 'react';
import MainBanner from '../components/layout/MainBanner.jsx';
import PopularCategories from '../components/layout/PopularCategories.jsx';
import MoneyBackBanner from '../components/layout/MoneyBackBanner.jsx';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Access authentication state and user info from context
  const { isAuthenticated, user, hasRole } = useAuth();

  return (
    <>
      <MainBanner />
      <PopularCategories />
    </>
  );
}

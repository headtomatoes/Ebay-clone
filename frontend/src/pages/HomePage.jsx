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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome to our store!</h1>
        </div>
      </div>

      <MainBanner />
      <PopularCategories />
      <MoneyBackBanner />

    </>
  );
}

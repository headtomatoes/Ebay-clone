import React from 'react';
import Header from '../components/layout/Header.jsx';
import MainBanner from '../components/layout/MainBanner.jsx';
import PopularCategories from '../components/layout/PopularCategories.jsx';
import MoneyBackBanner from '../components/layout/MoneyBackBanner.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Access authentication state and user info from context
  const { isAuthenticated, user, hasRole } = useAuth();

  return (
    <>
        <Header />
        {/* Greeting */}
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
                {isAuthenticated && user ? ( // Check user exists too
                    <h1 className="text-2xl font-semibold">
                        Hi, <span className="text-blue-600">{user.username}</span>! ({user.roles?.join(', ') || 'No roles assigned'})
                    </h1>
                ) : (
                    <h1 className="text-2xl font-semibold">Welcome to our store!</h1>
                )}
            </div>

            {/* Role-based content */}
            {isAuthenticated && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {hasRole('ROLE_ADMIN') && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-purple-800">Admin Panel</h2>
                            <p className="mb-4 text-purple-700">You have administrative privileges.</p>
                            <Link to="/admin" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">Go to Admin</Link>
                            {/* <ul className="list-disc list-inside text-sm text-purple-900 text-left mt-3">
                  <li>Manage users and permissions</li>
                  <li>Review system reports</li>
                </ul> */}
                        </div>
                    )}

                    {hasRole('ROLE_SELLER') && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-blue-800">Seller Tools</h2>
                            <p className="mb-4 text-blue-700">You can list and manage products.</p>
                            <Link to="/seller" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Go to Seller Dashboard</Link>
                            {/* <ul className="list-disc list-inside text-sm text-blue-900 text-left mt-3">
                   <li>Create new product listings</li>
                   <li>Manage your orders</li>
                 </ul> */}
                        </div>
                    )}

                    {/* Assume default is buyer or check explicitly */}
                    {(hasRole('ROLE_BUYER') || (!hasRole('ROLE_ADMIN') && !hasRole('ROLE_SELLER'))) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-green-800">Buyer Portal</h2>
                            <p className="mb-4 text-green-700">You can browse and purchase products.</p>
                            <Link to="/products" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Browse Products</Link>
                            {/* <ul className="list-disc list-inside text-sm text-green-900 text-left mt-3">
                  <li>Search and view product listings</li>
                  <li>Manage your profile</li>
                </ul> */}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Other Homepage Sections */}
        <MainBanner />
        <PopularCategories />
        <MoneyBackBanner />
        <Footer />
    </>
  );
}

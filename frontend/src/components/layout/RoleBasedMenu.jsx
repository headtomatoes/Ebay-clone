import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function RoleBasedMenu() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, hasRole } = useAuth();
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-gray-800 hover:underline"
      >
        ({user.roles.join(', ')})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50 text-sm">
          {hasRole('ROLE_BUYER') && (
            <div>
              <h2 className="text-green-700 font-semibold text-base mb-2">Buyer Portal</h2>
              <p className="mb-2">You can browse and purchase products.</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Search and view product listings</li>
                <li>Manage your profile</li>
              </ul>
            </div>
          )}
          {hasRole('ROLE_SELLER') && (
            <div>
              <Link to="/seller" className="block hover:underline text-blue-800 font-semibold mb-1">
                Seller Tools →
              </Link>
              <p className="mb-2 text-sm">You can list and manage products.</p>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Create new product listings</li>
                <li>Update prices and descriptions</li>
                <li>Track and manage your orders</li>
              </ul>
            </div>
          )}
          {hasRole('ROLE_ADMIN') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-800">Admin Panel</h2>
                <p className="mb-4">You have administrative privileges.</p>
                <ul className="list-disc list-inside text-sm text-purple-900 text-left">
                  <li>Manage users and permissions</li>
                  <li>Review system reports</li>
                  <li>Moderate product listings</li>
                </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

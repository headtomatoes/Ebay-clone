import React from 'react';
import ebayLogo from '../assets/EBay_logo.svg';
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header className="border-t text-[13px] font-normal">
      {/* Top bar */}
      <div className="border-t flex justify-between items-center px-6 py-1 bg-white text-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span>Hi!</span>
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          <span>or</span>
          <Link to="/register" className="text-blue-600 hover:underline">register</Link>

          <a href="#" className="ml-4 hover:underline">Daily Deals</a>
          <a href="#" className="hover:underline">Brand Outlet</a>
          <a href="#" className="hover:underline">Gift Cards</a>
          <a href="#" className="hover:underline">Help & Contact</a>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-800">
          <a href="#" className="hover:underline">Ship to</a>
          <a href="#" className="hover:underline">Sell</a>
          <a href="#" className="hover:underline">Watchlist ▾</a>
          <a href="#" className="hover:underline">My eBay ▾</a>
          <button>🔔</button>
          <button>🛒</button>
        </div>

      </div>

      {/* Logo + Search */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white">
        {/* eBay logo */}
        <img src={ebayLogo} alt="eBay" className="h-10 w-auto" />

        {/* Category dropdown */}
        <select className="border text-sm rounded-md px-3 py-[6px]">
          <option>Shop by category</option>
        </select>

        {/* Search bar */}
        <div className="flex-grow mx-8 flex items-center gap-2">
          {/* Search box with border */}
          <div className="flex items-center border-2 border-black rounded-full overflow-hidden w-full max-w-[700px]">
            {/* Icon search */}
            <div className="pl-4 pr-2 text-gray-500 text-lg">🔍</div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search for anything"
              className="flex-grow px-2 py-2 text-sm focus:outline-none"
            />

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Dropdown */}
            <select className="text-sm bg-white px-2 py-2 pr-4 focus:outline-none">
              <option>All Categories</option>
            </select>
          </div>
        </div>


        {/* Search button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold">
          Search
        </button>

        {/* Advanced link */}
        <a href="#" className="text-sm text-gray-500 ml-2 hover:underline">Advanced</a>


      </div>
      {/* Secondary nav */}
      <div className="border-t px-6 py-2 bg-white">
        <nav className="flex flex-wrap gap-x-6 text-sm text-black font-medium justify-center">
          <a href="#">eBay Live</a>
          <a href="#">Saved</a>
          <a href="#">Electronics</a>
          <a href="#">Motors</a>
          <a href="#">Fashion</a>
          <a href="#">Collectibles and Art</a>
          <a href="#">Sports</a>
          <a href="#">Health & Beauty</a>
          <a href="#">Industrial equipment</a>
          <a href="#">Home & Garden</a>
          <a href="#">Deals</a>
          <a href="#">Sell</a>
        </nav>
      </div>
    </header>
  );
}

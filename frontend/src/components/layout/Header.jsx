import React, { useEffect, useState } from 'react';
import ebayLogo from '../../assets/images/EBay_logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import CategoryService from '../../services/CategoryService';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchInput, setSearchInput] = useState('');


  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetch();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    if (selectedCategory === 'All Categories') {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    } else {
      navigate(
        `/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`
      );
    }
  };

  return (
    <header className="border-t text-[13px] font-normal">
      {/* Top bar */}
      <div className="border-t flex justify-between items-center px-6 py-1 bg-white text-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          {isAuthenticated ? (
            <>
              <span>
                Hi, <strong className="text-blue-600">{user.username}</strong>!
              </span>
              <button onClick={logout} className="ml-4 text-red-500 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <span>Hi!</span>
              <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
              <span>or</span>
              <Link to="/register" className="text-blue-600 hover:underline">register</Link>
            </>
          )}
          <a href="#" className="ml-4 hover:underline">Daily Deals</a>
          <a href="#" className="hover:underline">Brand Outlet</a>
          <a href="#" className="hover:underline">Gift Cards</a>
          <a href="#" className="hover:underline">Help & Contact</a>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-800">
          <a href="#" className="hover:underline">Ship to</a>
          <Link to="/seller"><a href="#" className="hover:underline">Sell</a></Link>
          <Link to="/auctions"><a href="#" className="hover:underline">Auction</a></Link>
          <a href="#" className="hover:underline">My eBay</a> {/* profile dropdown */}
          <ThemeToggle />
          <button>🔔</button>
          <button>🛒</button>
        </div>
      </div>

      {/* Logo + Search + Dropdown */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white relative">
        <Link to="/"> <img src={ebayLogo} alt="eBay" className="h-10 w-auto" /> </Link>

        {/* Shop by Category Dropdown */}
        <div className="relative">
          <button
            className="border text-sm rounded-md px-3 py-[6px] bg-white hover:bg-gray-100"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            Shop by category ▾
          </button>

          {openDropdown && (
            <div className="absolute top-10 left-0 z-50 bg-white border shadow-md rounded-md w-48">
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.name}`}
                  onClick={() => setOpenDropdown(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t my-1" />
              <Link
                to="/categories"
                onClick={() => setOpenDropdown(false)}
                className="block px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100"
              >
                All Categories
              </Link>
            </div>
          )}
        </div>

        {/* Search bar with Category Filter */}
        <form onSubmit={handleSearch} className="flex-grow mx-8 flex items-center gap-2 relative">
          <div className="flex items-center border-2 border-black rounded-full w-full max-w-[700px] relative">
            <div className="pl-4 pr-2 text-gray-500 text-lg">🔍</div>
            <input
              type="text"
              placeholder="Search for anything"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-grow px-2 py-2 text-sm focus:outline-none"
            />
            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Dropdown trigger for search category */}
            <button
              type="button"
              className="px-4 text-sm font-semibold text-gray-700 hover:text-black relative z-10"
              onClick={() => setShowSearchDropdown(!showSearchDropdown)}
            >
              {selectedCategory} ▾
            </button>

            {showSearchDropdown && (
              <div className="absolute right-0 top-11 z-50 bg-white border rounded-md shadow-md w-48 max-h-64 overflow-y-auto">
                {[{ id: 'all', name: 'All Categories' }, ...categories].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setShowSearchDropdown(false);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold">
            Search
          </button>
        </form>

        <a href="#" className="text-sm text-gray-500 ml-2 hover:underline">Advanced</a>
      </div>

      {/* Secondary nav */}
      <div className="border-t px-6 py-2 bg-white">
        <nav className="flex flex-wrap gap-x-6 text-sm text-black font-medium justify-center">
          <Link to="/products" className="hover:text-blue-600">Products</Link>
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

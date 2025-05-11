import React, { useEffect, useState } from 'react';
import ebayLogo from '../../assets/images/egaylogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import CategoryService from '../../services/CategoryService';
import ThemeToggle from './ThemeToggle.jsx';
import RoleBasedMenu from "./RoleBasedMenu.jsx";

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
    <header className="text-[13px] font-normal">
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
{/*           <a href="#" className="ml-4 hover:underline">Daily Deals</a> */}
{/*           <a href="#" className="hover:underline">Help & Contact</a> */}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-800">
{/*           <a href="#" className="hover:underline">Ship to</a> */}

          {user?.roles?.includes('ROLE_SELLER') && (
            <Link to="/seller" className="hover:underline">Sell</Link>
          )}

          <Link to="/auctions" className="hover:underline">Auction</Link>
          <Link to="/order" className="hover:underline">My orders</Link>{/* profile dropdown */}
          <ThemeToggle />
          <button>🔔</button>
          <Link to="/cart" className="hover:underline"><button>🛒</button></Link>
        </div>
      </div>

      {/* Logo + Search + Dropdown */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white relative border-t border-b">
        <Link to="/"> <img src={ebayLogo} alt="eBay" className="h-10 w-auto max-w-[200px]" /> </Link>

        {/* Search bar with Category Filter */}
        <div className="flex justify-center w-full">
            <form onSubmit={handleSearch} className="w-full max-w-3xl flex items-center gap-2 relative">
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

            {/*Dropdown trigger for search category */}
                <button
                  type="button"
                  className="px-4 text-sm font-semibold text-gray-700 relative z-10 rounded-tr-full rounded-br-full"
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

              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-full px-5 py-2 rounded-full text-sm font-semibold">
                Search
              </button>
            </form>


        </div>
        <RoleBasedMenu />
      </div>


        {/* Secondary nav */}
        <div className="border-t px-6 py-2 bg-white">
          <nav className="flex flex-wrap gap-x-6 text-sm text-black font-medium justify-center">
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            {categories.slice(0, 12).map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.name}`}
                className="hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/categories"
              className="text-black-600 font-semibold hover:underline"
            >
              All Categories
            </Link>
          </nav>
        </div>
    </header>
  );
}
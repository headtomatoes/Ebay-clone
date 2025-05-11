import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CategoryProductPage from './pages/CategoryProductPage';
import SearchResultPage from './pages/SearchResultPage';
import AddAuctionPage from './pages/AddAuctionPage';
import AuctionPage from "./pages/AuctionPage";
import AuctionDetailPage from './pages/AuctionDetailPage';
import AddProductPage from './pages/AddProductPage';
import UpdateProductPage from './pages/UpdateProductPage';
import SellerPage from './pages/SellerPage';

// Toast notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartPage from "./pages/CartPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

import OAuth2Redirect from './pages/OAuth2Redirect';
import OrderDetailPage from "./pages/OrderDetailPage.jsx";

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          theme="light"
        />
  </div>
);

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/" element={<HomePage />} /> {/* Home is public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/categories/:categoryName" element={<CategoryProductPage />} />
              <Route path="/search" element={<SearchResultPage />} />

              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                {/* Admin-only routes */}
                <Route element={<RoleBasedRoute requiredRole="ROLE_ADMIN" />}>
                  <Route path="/admin" element={<div>Admin Page</div>} />
                </Route>

                {/* Seller-only routes */}
                <Route element={<RoleBasedRoute requiredRole="ROLE_SELLER" />}>
                  <Route path="/seller/products/new" element={<AddProductPage />} />
                  <Route path="/seller/products/update/:id" element={<UpdateProductPage />} />
                  <Route path="/seller" element={<SellerPage />} />
                  <Route path="/seller/auction/create/:id" element={<AddAuctionPage />} />
                </Route>

                {/* Other routes that need login */}
                <Route path="/auctions" element={<AuctionPage />} />
                <Route path="/auctions/:id" element={<AuctionDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>

              <Route path="*" element={<div>Page not found</div>} />
            </Route>
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
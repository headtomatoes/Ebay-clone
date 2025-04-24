// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />

                <Route element={<RoleBasedRoute requiredRole="ROLE_ADMIN" />}>
                  <Route path="/admin" element={<div>Admin Page</div>} />
                </Route>

                <Route element={<RoleBasedRoute requiredRole="ROLE_SELLER" />}>
                  <Route path="/seller" element={<div>Seller Dashboard</div>} />
                </Route>
              </Route>

              <Route path="*" element={<div>Page not found</div>} />
            </Route>
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
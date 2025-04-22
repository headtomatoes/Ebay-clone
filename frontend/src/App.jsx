import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/ProtectedRoute';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Import Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// A Layout component to wrap pages with Header and Footer
const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow"> {/* Outlet renders the matched Route's element here */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <AuthProvider> {/* AuthProvider wraps everything */}
            <Router>
                <Routes>
                    {/* Routes using the MainLayout (Header/Footer) */}
                    <Route element={<MainLayout />}>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Protected routes - require authentication */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<HomePage />} /> {/* HomePage will use the components like MainBanner etc. */}

                            {/* Role-based routes - examples */}
                            <Route element={<RoleBasedRoute requiredRole="ROLE_ADMIN" />}>
                                <Route path="/admin" element={<div>Admin Page (Content Here)</div>} />
                            </Route>

                            <Route element={<RoleBasedRoute requiredRole="ROLE_SELLER" />}>
                                <Route path="/seller" element={<div>Seller Dashboard (Content Here)</div>} />
                            </Route>
                            {/* Add other protected routes here */}
                        </Route>

                        {/* Catch-all route or specific 404 component */}
                        <Route path="*" element={<div>Page not found</div>} />
                    </Route>

                    {/* You could have other routes OUTSIDE MainLayout if needed */}
                    {/* e.g., a special fullscreen route */}

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
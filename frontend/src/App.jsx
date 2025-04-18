import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
// import AdminPage from './pages/AdminPage';
// import SellerPage from './pages/SellerPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
{/*           <Route path="/admin" element={<AdminPage />} /> */}
{/*           <Route path="/seller" element={<SellerPage />} /> */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

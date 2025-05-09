import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          New to eBay?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Create account
          </a>
        </p>

        <LoginForm successMessage={message} />

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google login button */}
        <button
          type="button"
          className="w-full flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
{/*           <img src={googleIcon} alt="Google" className="w-5 h-5 mr-3" /> */}
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import LoginForm from '../components/auth/LoginForm';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

function LoginPage() {
    const location = useLocation(); // Get location state
    const message = location.state?.message; // Extract message if present

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                {/* Pass the message down to the LoginForm */}
                <LoginForm successMessage={message} />
            </div>
        </div>
    );
}
export default LoginPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Import the REAL login function from your service
import {loginUser, setAuthToken} from '../../services/AuthService'

export default function LoginForm({ successMessage }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(''); // State for backend errors
    const [loading, setLoading] = useState(false); // Loading state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        } // Clear validation error on change
        setApiError(''); // Clear API error on change
    };

    const validate = () => {
        // Your existing validation logic...
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // *** UPDATED handleSubmit ***
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(''); // Clear previous API errors
        if (!validate()) return;

        setLoading(true); // Set loading true

        try {
            // Call the REAL backend service
            const response = await loginUser(formData); // Send {username, password}

            // Extract data from the actual backend response
            // Ensure your backend returns these fields in JwtResponseDTO
            const { accessToken, id, username, email, roles } = response;

            // Set token for future axios requests IMMEDIATELY after getting it
            setAuthToken(accessToken);

            // Set token for future requests (optional but good practice)
            // setAuthToken(accessToken); // If your authService requires it

            // Update AuthContext state
            login(accessToken, { id, username, email, roles });

            // Redirect to home page after successful login
            navigate('/');

        } catch (err) {
            console.error('Login failed:', err);
            // Display error message from backend response or a generic one
            setApiError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false); // Set loading false
        }
    };

    return (
        // Using Tailwind classes for styling - ensure Tailwind is set up
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display success message from registration if passed */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            {/* Display API errors from backend */}
            {apiError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{apiError}</span>
                </div>
            )}

            {/* Username Field */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.username ? 'border-red-500' : ''}`}
                    aria-invalid={errors.username ? "true" : "false"}
                    aria-describedby={errors.username ? "username-error" : undefined}
                />
                {errors.username && (
                    <p id="username-error" className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : ''}`}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </form>
    );
}

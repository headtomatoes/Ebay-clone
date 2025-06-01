import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser, setAuthToken } from '../../services/AuthService';
import axios from 'axios';

export default function LoginForm({ successMessage }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password reset state
  const [showReset, setShowReset] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');

    if (!resetUsername.trim()) {
      setResetMsg('Please enter your username.');
      return;
    }

    try {
      await axios.post('http://localhost:8082/api/auth/reset-password', null, {
        params: { username: resetUsername }
      });
      setResetMsg('Password reset! Please try logging in with "123456".');
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 400) {
        setResetMsg('Username not found. Please check your username and try again.');
      } else {
        setResetMsg(err.response?.data?.message || 'Reset failed. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await loginUser(formData);
      const { token, id, username, email, roles } = response;

      setAuthToken(token);
      login(token, { id, username, email, roles });
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {apiError && (
          <p className="text-red-500 mb-3 text-center">{apiError}</p>
        )}

        {['username', 'password'].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block mb-1 font-semibold"
            >
              {field === 'username' ? 'Username' : 'Password'}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg bg-blue-600 text-white font-semibold ${loading ? 'opacity-60' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-2">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setShowReset(!showReset)}
          >
            Forgot password?
          </button>
        </div>
      </form>

      {showReset && (
        <form
          onSubmit={handleResetPassword}
          className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
        >
          <label htmlFor="resetUsername" className="block mb-1 font-semibold">
            Enter your username to reset password:
          </label>
          <input
            id="resetUsername"
            value={resetUsername}
            onChange={(e) => setResetUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Reset Password
          </button>
          {resetMsg && (
            <p
              className={`mt-2 text-center ${resetMsg.startsWith('Password reset') ? 'text-green-600' : 'text-red-500'}`}
            >
              {resetMsg}
            </p>
          )}
        </form>
      )}
    </>
  );
}
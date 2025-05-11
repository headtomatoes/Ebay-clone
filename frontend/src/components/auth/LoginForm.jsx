import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Import the REAL login function from your service
import {loginUser, setAuthToken} from '../../services/AuthService'
import GoogleLoginButton from './GoogleLoginButton';

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
            //const { accessToken, id, username, email, roles } = response;
            const { token, id, username, email, roles } = response;

            // Set token for future axios requests IMMEDIATELY after getting it
            //setAuthToken(accessToken);

            // Set token for future requests (optional but good practice)
            //setAuthToken(accessToken); // If your authService requires it
            setAuthToken(token);

            // Update AuthContext state
            login(token, { id, username, email, roles });
            //login(accessToken, { id, username, email, roles });
            console.log('Login API response:', response);


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
        // Add display for apiError
        // Add disabled state to button based on loading
//         <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
//             {apiError && (
//                 <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{apiError}</p>
//             )}
//             {['username', 'password'].map((field) => (
//                 <div key={field} style={{ marginBottom: '15px' }}>
//                     {/* ... label and input ... */}
//                     {errors[field] && (
//                         <p style={{ color: 'red', marginTop: '5px' }}>{errors[field]}</p>
//                     )}
//                 </div>
//             ))}
//             <button
//                 type="submit"
//                 disabled={loading} // Disable button while loading
//                 style={{ /* ... styles ... */ opacity: loading ? 0.6 : 1 }}
//             >
//                 {loading ? 'Logging in...' : 'Login'}
//             </button>
//         </form>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
{/*           <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: 'bold' }}>Sign in to your account</h2> */}

          {apiError && (
            <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{apiError}</p>
          )}

          {['username', 'password'].map((field) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label htmlFor={field} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {field === 'username' ? 'Username' : 'Password'}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '14px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
              {errors[field] && (
                <p style={{ color: 'red', marginTop: '5px' }}>{errors[field]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3665f3',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

    );
}

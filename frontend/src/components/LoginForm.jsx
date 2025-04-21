import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockLogin } from '../services/mockLogin';
//import { loginUser } from '../services/authService;

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//     // Handle form submission with real API
//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;
//
//         try {
//           // Send login request to backend
//           const { token, user } = await loginUser(formData);
//
//           // Update AuthContext with token + user info
//           login(token, user);
//
//           // Redirect to homepage
//           navigate('/');
//         } catch (err) {
//           console.error('Login failed:', err.message || err);
//           alert(err.message || 'Login failed. Please try again.');
//         }
//       };

    // Handle form submit demo
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validate()) return;

      // Use mockLogin to simulate authentication
      const result = mockLogin(formData.username, formData.password);

      if (!result) {
        alert('error');
        return;
      }

      const { token, user } = result;
      login(token, user);

      // Redirect to home page after login
      // Role-based content will be shown in Home based on user.roles
      navigate('/');
    };


  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      {['username', 'password'].map((field) => (
        <div key={field} style={{ marginBottom: '15px' }}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label><br />
          <input
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: errors[field] ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors[field] && (
            <p style={{ color: 'red', marginTop: '5px' }}>{errors[field]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Login
      </button>
    </form>
  );
}

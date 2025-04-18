import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockRegister } from '../services/mockRegister';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const { login } = useAuth(); // login() from AuthContext
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate registration using mock function
    const result = mockRegister(formData.username, formData.email, formData.password);

    if (!result) {
      alert('Username already exists!');
      return;
    }

    // Auto-login after successful registration
    login(result.token, result.user);
    navigate('/'); //homepage
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      {['username', 'email', 'password'].map((field) => (
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
        Sign Up
      </button>
    </form>
  );
}

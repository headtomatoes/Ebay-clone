import React, { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Register success!');
      console.log('Registering with:', formData);
    }
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

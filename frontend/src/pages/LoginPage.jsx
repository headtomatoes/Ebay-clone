import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <p>
        Don’t have an account?{' '}
        <a href="/register" style={{ color: 'blue' }}>Register here</a>
      </p>

      <LoginForm />
    </div>
  );
}

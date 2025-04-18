import React from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>
      <p>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'blue' }}>Login here</a>
      </p>

      <RegisterForm />

    </div>
  );
}

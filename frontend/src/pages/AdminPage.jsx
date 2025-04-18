import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  return <h1>Hi admin, {user?.username}!</h1>;
}

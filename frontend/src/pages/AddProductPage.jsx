import React, { useState } from 'react';
import ProductService from '../services/ProductService';
import ProductForm from '../components/product/ProductForm';

export default function AddProductPage() {
  const [message, setMessage] = useState('');

  const handleCreate = async (data) => {
    try {
      await ProductService.createProduct(data);
      setMessage(' Product created successfully!');
    } catch (err) {
      setMessage(` ${err.message || 'Failed to create product'}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}

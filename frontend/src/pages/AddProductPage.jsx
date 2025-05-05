import React, { useState } from 'react';
import ProductService from '../services/ProductService';
import ProductForm from '../components/product/ProductForm';
import { useNavigate } from 'react-router-dom';

export default function AddProductPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigating to another page after creating a product

  //Handle product creation form submission
  const handleCreate = async (data) => {
    try {
      await ProductService.createProduct(data); // Send create request to backend
      alert('Product created successfully!');
      navigate('/products'); //Redirect to All Products page after successful creation
    } catch (err) {
      console.error('Failed to create product:', err);
      setMessage(err.message || 'Failed to create product.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Product</h1>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
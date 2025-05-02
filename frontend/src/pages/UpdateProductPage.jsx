import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import ProductForm from '../components/product/ProductForm';

const UpdateProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State to store existing product data
  const [message, setMessage] = useState('');

  // Fetch product details when page loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle form submit to update product
  const handleUpdate = async (updatedData) => {
    try {
      await ProductService.updateProduct(id, updatedData);
      alert('Product updated successfully!');
      navigate('/products'); // Redirect back to SellerPage
    } catch (err) {
      console.error('Failed to update product:', err);
      setMessage(err.message || 'Failed to update product.');
    }
  };

  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Update Product</h1>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <ProductForm onSubmit={handleUpdate} initialData={product} />
    </div>
  );
};

export default UpdateProductPage;
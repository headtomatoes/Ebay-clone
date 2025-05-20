import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import ProductForm from '../components/product/ProductForm';

const UpdateProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch product details
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

  const handleUpdate = async (updatedData) => {
    try {
      await ProductService.updateProduct(id, updatedData);
      alert('Product updated successfully!');
      navigate('/products'); // Redirect to product list after update
    } catch (err) {
      console.error('Failed to update product:', err);
      setMessage(err.message || 'Failed to update product.');
    }
  };

  // Show loading message
  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
       {/* Left Panel: Product Preview */}
      <div className="md:col-span-4 bg-white border rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="mb-2"><strong>Description:</strong> {product.description}</p>
        <p className="mb-1"><strong>Price:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stockQuantity}</p>
      </div>

      {/* Right Panel: Product Update Form */}
      <div className="md:col-span-6 bg-white border rounded shadow p-4">
        <ProductForm onSubmit={handleUpdate} initialData={product} />
      </div>
    </div>
  );
};

export default UpdateProductPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import ProductDetailSection from "../components/product/ProductDetailSection";
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetailPage() {
  const { productId } = useParams();  //Get the product ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null); // State to store product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  //Handle product deletion
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(product.productId);
        alert('Product deleted successfully!');
        navigate('/products'); // Navigate back to all products
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  //Handle loading and error states
  if (loading) return <div className="text-center mt-20">Loading product details...</div>;
  if (error || !product) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">← Back</button>
      <ProductDetailSection product={product} />

      {user?.roles?.includes('ROLE_SELLER') && user?.username === product.sellerUsername && (
        <div className="flex space-x-4 mt-6">
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete This Product
          </button>

          {/* Update button */}
          <button
            onClick={() => navigate(`/seller/products/update/${product.productId}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update This Product
          </button>
          {/* Create Auction button */}
          <button
            onClick={() => navigate(`/seller/auction/create/${product.productId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Auction
          </button>
        </div>
      )}
    </div>
  );
}
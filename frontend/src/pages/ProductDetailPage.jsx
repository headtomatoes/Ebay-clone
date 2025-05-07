import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import { useAuth } from '../contexts/AuthContext';
import CartService from "../services/CartService.jsx";

export default function ProductDetailPage() {
  const { productId } = useParams();  //Get the product ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null); // State to store product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //State to handle adding to cart
  const [isAdding, setIsAdding] = useState(false); // State to manage adding to cart
  const [successMessage, setSuccessMessage] = useState('');

  // Assuming you want to add 1 unit of the product by default
  const quantity = 1;

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

  //Handle adding product to cart
  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    if (!product || !product.productId) { // Make sure product and product.id are available
      setError("Product information is missing.");
      return;
    }

    setIsAdding(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Call the addToCart function from your CartService
      // Pass the productId and quantity
      const response = await CartService.addToCart(product.productId, quantity);
      setSuccessMessage(`${product.name || 'Product'} added to cart!`);
      console.log("Add to cart response:", response);
      // You might want to update a global cart state or show a notification here
    } catch (err) {
      setError(`Failed to add to cart: ${err.message || 'Unknown error'}`);
      console.error("Error adding to cart:", err);
    } finally {
      setIsAdding(false);
      // Clear messages after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 3000);
    }

  }


  //Handle loading and error states
  if (loading) return <div className="text-center mt-20">Loading product details...</div>;
  if (error || !product) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">← Back</button>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Image Gallery + Main Image */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* Main Image */}
          <div>

            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-[400px] h-[400px] object-cover rounded shadow"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-red-600 mb-4">${product.price}</p>
          <p className="text-gray-700 text-sm mb-6">{product.description}</p>
          <p className="text-gray-700 text-sm mb-6">Seller: {product.sellerUsername}</p>
          <p className="text-gray-700 text-sm mb-6">Category: {product.categoryName}</p>
          <p className="text-gray-700 text-sm mb-6">Stock: {product.stockQuantity}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-[250px]">
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {successMessage && <p className="text-sm text-green-500 mt-2">{successMessage}</p>}

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Buy It Now</button>
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded">
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="text-blue-600 underline text-sm">Add to Watchlist</button>
          </div>
        </div>
      </div>

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
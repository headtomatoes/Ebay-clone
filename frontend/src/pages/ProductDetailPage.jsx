import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import { useAuth } from '../contexts/AuthContext';
import CartService from "../services/CartService.jsx";
import { toast } from 'react-toastify';
import RandomProductList from '../components/product/RandomProductList';

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
  const [quantity, setQuantity] = useState(1); // State for quantity input

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
      toast.success(`${product.name || 'Product'} added to cart!`);
      //console.log("Add to cart response:", response);
      // You might want to update a global cart state or show a notification here
    } catch (err) {
      toast.error(`Failed to add to cart: ${err.message || 'Unknown error'}`);
      //console.error("Error adding to cart:", err);
    } finally {
      setIsAdding(false);
    }
  }

  // Handle buying now
  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to buy products.');
      return;
    }
    if (!product || !product.productId) {
      setError("Product information is missing.");
      return;
    }

    //setIsAdding(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Always add 1 quantity when buying now
      await CartService.addToCart(product.productId, 1);
      toast.success(`${product.name || 'Product'} added to cart!`);

      // After adding successfully, redirect to cart page
      navigate('/cart');
    } catch (err) {
      toast.error(`Failed to buy product: ${err.message || 'Unknown error'}`);
    } finally {
      setIsAdding(false);
    }
  };



  function Accordion({ title, children }) {
    // State to track whether the accordion is open (true) or closed (false)
    const [open, setOpen] = useState(false);

    return (
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setOpen(!open)} // Toggle the open state on click
          className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-800"
        >
          <span>{title}</span>

          {/* Display '+' when closed and '−' when open */}
          <span className="text-xl">{open ? "−" : "+"}</span>
        </button>

        {/* Accordion content area */}
        <div
          className={`transition-all duration-300 ease-in-out px-4 text-sm text-gray-700 ${
            open ? 'max-h-[500px] py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
          } overflow-hidden`}
        >
          {children}
        </div>
      </div>
    );
  }

  //Handle loading and error states
  if (loading) return <div className="text-center mt-20">Loading product details...</div>;
  if (error || !product) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">← Back</button>
        <div className="flex flex-col md:flex-row gap-6 items-start p-6">
          {/* Image Gallery + Main Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Main Image */}
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-[500px] h-[500px] object-cover rounded shadow"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-between min-h-[500px]">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-red-600 mb-4">${product.price}</p>
            <p className="text-gray-700 text-sm mb-6">Stock: {product.stockQuantity}</p>

            {/* Action Buttons */}
            <div className="mb-4 space-y-2">
              {/* Quantity input */}
              <div className="w-fit">
                <label htmlFor="quantity" className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 h-9 text-sm px-2 border rounded-full text-center"
                />
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="rounded-full px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium"
                >
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="rounded-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Buy Now
                </button>
              </div>

              {/* Accordion section */}
              <div className="mt-8 w-[360px] space-y-2 ">
                <Accordion title="Product Info">
                  <p className="mb-4 pl-4">{product.description}</p>
                  <p className="mb-4 pl-4">Seller: {product.sellerUsername}</p>
                  <p className="mb-4 pl-4">Category: {product.categoryName}</p>
                </Accordion>

                <Accordion title="Shipping Times & Costs">
                  <p className="mb-4 pl-4">Ships within 2–5 business days. Free shipping on orders over $50.</p>
                </Accordion>

                <Accordion title="Returns Policy">
                  <p className="mb-4 pl-4">Returnable within 15 days of delivery in original condition. See full policy for more.</p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <RandomProductList excludeId={product.productId} />

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
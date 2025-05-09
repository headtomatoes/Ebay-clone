import React, { useState, useEffect } from 'react';
import CartService from '../services/CartService';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemBeingRemoved, setItemBeingRemoved] = useState(null);
  const [quantitiesToRemove, setQuantitiesToRemove] = useState({});
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CartService.getAllCartItems();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to load cart: ${err.message || 'Unknown error'}`);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (item) => {
    const productIdToRemove = item.productId;
    const quantityToRemove = quantitiesToRemove[productIdToRemove] || 1;
    if (!productIdToRemove || quantityToRemove <= 0) return;

    setItemBeingRemoved(productIdToRemove);
    try {
      await CartService.removeFromCart(productIdToRemove, quantityToRemove);
      fetchCartItems();
    } catch (err) {
      setError(`Failed to remove item: ${err.message || 'Unknown error'}`);
    } finally {
      setItemBeingRemoved(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear the entire cart?')) {
      setIsLoading(true);
      try {
        await CartService.clearCart();
        fetchCartItems();
      } catch (err) {
        setError(`Failed to clear cart: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) return <div className="p-4 text-center">Loading cart...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400">{error}</div>}

      {!cartItems || cartItems.length === 0 ? (
        <div className="p-4 text-center text-gray-600">
          Your cart is empty.
          <br />
          <Link to="/products" className="text-blue-500 hover:underline mt-2 inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Subtotal</th>
                  <th className="px-4 py-2">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.productId || item.name} className="border-b">
                    <td className="px-4 py-3 flex items-center gap-4">
                      <img
                        src={item.productImageUrl}
                        alt={item.productName || 'Product'}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-xs text-gray-500">ID: {item.productId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">${item.price?.toFixed(2)}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={quantitiesToRemove[item.productId] || ''}
                          onChange={(e) =>
                            setQuantitiesToRemove(prev => ({
                              ...prev,
                              [item.productId]: parseInt(e.target.value) || ''
                            }))
                          }
                          className="w-12 px-2 py-1 border rounded text-sm text-center"
                        />
                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={itemBeingRemoved === item.productId}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full"
                        >
                          {itemBeingRemoved === item.productId ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Total: ${calculateSubtotal().toFixed(2)}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleClearCart}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

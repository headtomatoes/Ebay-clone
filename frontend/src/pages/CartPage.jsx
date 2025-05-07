import React, { useState, useEffect } from 'react';
import CartService from '../services/CartService';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemBeingRemoved, setItemBeingRemoved] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const fetchCartItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await CartService.getAllCartItems();
            setCartItems(Array.isArray(data) ? data : []);
            if (!Array.isArray(data)) {
                console.warn("Received non-array data for cart items:", data);
            }
        } catch (err) {
            setError(`Failed to load cart: ${err.message || 'Unknown error'}`);
            console.error("Error fetching cart items:", err);
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
        const quantityToRemove = item.quantity;

        if (typeof productIdToRemove === 'undefined') {
            setError(`Cannot remove item. Product ID is missing.`);
            return;
        }
        if (typeof quantityToRemove === 'undefined' || quantityToRemove <= 0) {
            setError(`Cannot remove item. Quantity is missing or invalid for product ID ${productIdToRemove}.`);
            return;
        }

        setItemBeingRemoved(productIdToRemove);
        setError(null);

        try {
            await CartService.removeFromCart(productIdToRemove, quantityToRemove);
            fetchCartItems();
        } catch (err) {
            setError(`Failed to remove item (ID: ${productIdToRemove}): ${err.message || 'Unknown error'}`);
        } finally {
            setItemBeingRemoved(null);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear the entire cart?')) {
            setIsLoading(true); // Indicate activity
            try {
                await CartService.clearCart();
                fetchCartItems(); // Refresh to show empty cart
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
            {error && <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

            {!cartItems || cartItems.length === 0 ? (
                <div className="p-4 text-center text-gray-600">
                    Your cart is empty.
                    <br />
                    <Link to="/products" className="text-blue-500 hover:underline mt-2 inline-block">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map(item => (
                            <li key={item.productId || item.name} className="py-4 flex flex-col md:flex-row justify-between items-center">
                                <div className="flex items-center mb-3 md:mb-0">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name || 'Product Image'} className="w-24 h-24 object-cover rounded mr-4 shadow"/>
                                    )}
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold text-gray-800">{item.name || 'Product Name Missing'}</h2>
                                        <p className="text-sm text-gray-500">ID: {item.productId || 'N/A'}</p>
                                        <p className="text-md text-gray-700 mt-1">Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => handleRemoveItem(item)}
                                        disabled={itemBeingRemoved === item.productId}
                                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-xs transition-colors disabled:opacity-50"
                                    >
                                        {itemBeingRemoved === item.productId ? 'Removing...' : 'Remove'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Grand Total: ${calculateSubtotal().toFixed(2)}
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={handleClearCart}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={() => navigate('/checkout')} // Navigate to checkout
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
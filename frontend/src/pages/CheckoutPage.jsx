import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import CartService from '../services/CartService'; // To get cart total or clear cart
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const fetchCartDetails = async () => {
            setIsLoading(true);
            try {
                const cartData = await CartService.getAllCartItems();
                if (Array.isArray(cartData)) {
                    setCartItems(cartData);
                    const total = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    setCartTotal(total);
                    setCartItemCount(cartData.reduce((count, item) => count + item.quantity, 0));
                } else {
                    setCartTotal(0);
                    setCartItemCount(0);
                }
            } catch (err) {
                console.error("Failed to fetch cart details for checkout:", err);
                setError("Could not load cart details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchCartDetails();
        } else {
            navigate('/login'); // Redirect if not logged in
        }
    }, [user, navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the simplified createOrderFromCart which doesn't require address details upfront
            const createdOrder = await OrderService.createOrderFromCart();
            // The backend should handle clearing the cart after successful order creation.
            // If CartService.clearCart() is still needed on the frontend, ensure it's called.
            // For now, we assume backend handles it.
            alert(`Order placed successfully! Order ID: ${createdOrder.orderId}. You will be redirected to your orders page.`);
            navigate('/order');
        } catch (err) {
            console.error('Error placing order:', err);
            setError(`Failed to place order: ${err.message || 'An unknown error occurred.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user && !isLoading) // Avoid brief flash of "Redirecting" if user is quickly available
        return <div className="p-4 text-center">Redirecting to login...</div>;

    if (isLoading && cartItemCount === 0) // Show loading only if we haven't determined cart state
        return <div className="p-4 text-center">Loading checkout details...</div>;
    if (!isLoading && cartItemCount === 0) {
        return (
            <div className="container mx-auto p-4 max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <p className="text-lg mb-4">Your cart is empty.</p>
                <p className="mb-6">Please add items to your cart before proceeding to checkout.</p>
                <button onClick={() => navigate('/products')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Shop Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Review Your Order</h1>

            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="py-2">Product</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.productId} className="border-b">
                                <td className="py-2 flex items-center gap-4">
                                    <img src={item.productImageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                                    <span>{item.productName}</span>
                                </td>
                                <td className="py-2">${item.price.toFixed(2)}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-6 text-right text-lg font-semibold">
                    Total Amount: <span className="text-green-600">${cartTotal.toFixed(2)}</span>
                </div>
            </div>

            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

            {/* Placeholder for future Payment Section - can be minimal for now */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment</h3>
                <p className="text-sm text-gray-500">
                    Proceeding will create your order with <strong>'Pending Payment'</strong> status.
                    Payment processing will be handled subsequently.
                </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="max-w-md mx-auto">
                <button
                    type="submit"
                    disabled={isLoading || cartItemCount === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                    {isLoading ? 'Placing Order...' : 'Confirm and Place Order'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;
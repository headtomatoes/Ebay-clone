import React, { useState, useEffect } from 'react';
import orderService from '../services/OrderService'; // Adjust path as needed
import { Link } from 'react-router-dom'; // If you want to link to order details

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await orderService.getAllOrders();
            setOrders(Array.isArray(data) ? data : []);
            if (!Array.isArray(data)) {
                console.warn("Received non-array data for orders:", data)
            }
            setError(null);
        } catch (err) {
            setError(`Failed to load orders: ${err.message || 'Unknown error'}`);
            console.error("Error fetching orders:", err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
            try {
                await orderService.cancelOrder(orderId);
                // Refresh orders list
                fetchOrders();
            } catch (err) {
                setError(`Failed to cancel order ${orderId}: ${err.message || 'Unknown error'}`);
                console.error("Error cancelling order:", err);
            }
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading orders...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
            {error && <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

            {!orders || orders.length === 0 ? (
                <div className="p-4 text-center text-gray-600">You have no orders.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.orderId} className="p-6 border rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-700">Order ID: {order.orderId}</h2>
                                    <p className="text-sm text-gray-500">
                                        Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    order.status === 'CANCELLED' ? 'bg-red-200 text-red-800' :
                                        order.status === 'COMPLETED' ? 'bg-green-200 text-green-800' : // Example status
                                            'bg-yellow-200 text-yellow-800' // Default for other statuses
                                }`}>
                                    Status: {order.status || 'N/A'}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-1">
                                Total Amount:
                                <span className="font-semibold text-gray-800">
                                     ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                                </span>
                            </p>

                            {order.items && order.items.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Items:</h3>
                                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-600">
                                        {order.items.map((item, index) => (
                                            <li key={item.orderItemId || item.productId || index}> {/* Ensure unique key */}
                                                {item.productName || 'Unknown Product'} (Quantity: {item.quantity})
                                                - ${item.price ? item.price.toFixed(2) : 'N/A'} each
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Optional: Link to a more detailed order view page */}
                            {/* <Link to={`/orders/${order.orderId}`} className="text-blue-500 hover:underline mt-3 inline-block">View Details</Link> */}

                            {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && ( // Example condition
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                            {order.status === 'PENDING_PAYMENT' && (
                              <button
                                onClick={() => window.location.href = `/payment/${order.orderId}`}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm ml-2 transition-colors"
                              >
                                Pay Now
                              </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
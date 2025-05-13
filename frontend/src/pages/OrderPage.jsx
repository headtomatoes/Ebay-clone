import React, { useState, useEffect } from 'react';
import orderService from '../services/OrderService'; // Adjust path as needed
import { Link, useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                                        order.status === 'COMPLETED' ? 'bg-green-200 text-green-800' :
                                            order.status === 'PROCESSING' ? 'bg-blue-200 text-blue-800' :
                                                'bg-yellow-200 text-yellow-800'
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

                            {/* Mini item summary - keep this brief */}
                            {order.items && order.items.length > 0 && (
                                <div className="mt-3 mb-3">
                                    <p className="text-sm text-gray-600">
                                        {order.items.length} item(s) -
                                        Preview: {order.items[0].productName}{order.items.length > 1 ? ' and more...' : ''}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2 justify-end items-center">
                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors"
                                >
                                    View Details
                                </Link>
                                {order.status === 'PENDING_PAYMENT' && (
                                    <button
                                        onClick={() => navigate(`/checkout?orderId=${order.orderId}`)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                                    >
                                        Pay Now
                                    </button>
                                )}
                                {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && order.status !== 'PROCESSING' && (
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
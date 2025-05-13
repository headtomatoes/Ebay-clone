import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import orderService from '../services/OrderService'; // Adjust path as needed

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) return;
            setIsLoading(true);
            try {
                const data = await orderService.getOrderById(orderId);
                setOrder(data);
                setError(null);
            } catch (err) {
                setError(`Failed to load order details: ${err.message || 'Unknown error'}`);
                console.error(`Error fetching order ${orderId}:`, err);
                setOrder(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (isLoading) return <div className="p-4 text-center">Loading order details...</div>;
    if (error) return <div className="p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>;
    if (!order) return <div className="p-4 text-center text-gray-600">Order not found.</div>;

    const getStatusClasses = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-700';
            case 'PENDING_PAYMENT':
                return 'bg-yellow-100 text-yellow-700';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-700';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-700';
            case 'DELIVERED':
                return 'bg-teal-100 text-teal-700';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-xl rounded-lg p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                        <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                        {order.customerName && <p className="text-sm text-gray-500">Customer: {order.customerName}</p>}
                    </div>
                    <Link to="/order" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        &larr; Back to My Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Information</h2>
                        <p className="text-gray-600">
                            <strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-600">
                            <strong>Status:</strong>
                            <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                {order.status || 'N/A'}
                            </span>
                        </p>
                        <p className="text-gray-600 mt-1">
                            <strong>Total Amount:</strong>
                            <span className="font-bold text-gray-800"> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
                        </p>
                    </div>

                    {order.shippingAddressSnapshot && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Shipping Address</h2>
                            <p className="text-gray-600 whitespace-pre-line">{order.shippingAddressSnapshot}</p>
                        </div>
                    )}
                    {order.billingAddressSnapshot && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Billing Address</h2>
                            <p className="text-gray-600 whitespace-pre-line">{order.billingAddressSnapshot}</p>
                        </div>
                    )}
                </div>


                {order.orderItems && order.orderItems.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Items in this Order</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.productImageUrl} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 rounded-lg shadow">
                                    {item.productImageUrl && (
                                        <img
                                            src={item.productImageUrl}
                                            alt={item.productName || 'Product image'}
                                            className="w-20 h-20 object-cover rounded-md mr-0 mb-3 sm:mr-4 sm:mb-0"
                                        />
                                    )}
                                    <div className="flex-grow mb-2 sm:mb-0">
                                        <Link to={`/products/${item.productId}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                                            {item.productName || 'Unknown Product'}
                                        </Link>
                                        <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-sm text-gray-600">
                                            Price per item: ${item.priceAtPurchase ? (item.priceAtPurchase / item.quantity).toFixed(2) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto">
                                        <p className="text-md font-semibold text-gray-700">
                                            Subtotal: ${item.priceAtPurchase && item.quantity ? (item.priceAtPurchase).toFixed(2) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    {order.status === 'PENDING_PAYMENT' && (
                        <button
                            onClick={() => navigate(`/checkout?orderId=${order.orderId}`)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Complete Payment
                        </button>
                    )}
                    {/* Example: Link to track package if shipped */}
                    {/* order.status === 'SHIPPED' && order.trackingNumber && (
                        <a
                            href={`your_tracking_url_prefix/${order.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Track Package
                        </a>
                    )*/}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
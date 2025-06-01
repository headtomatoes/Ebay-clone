import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderService from '../services/OrderService';
import CartService from '../services/CartService';
import PaymentService from '../services/PaymentService';
import { useAuth } from '../contexts/AuthContext';
import StripeCheckoutForm from '../components/payments/StripeCheckoutForm';
import CODCheckoutForm from '../components/payments/CODCheckoutForm';

// Define the checkout process steps
const CHECKOUT_STEPS = {
    REVIEW_ORDER: 'REVIEW_ORDER',
    SELECT_PAYMENT: 'SELECT_PAYMENT',
    PROCESS_PAYMENT: 'PROCESS_PAYMENT',
    CONFIRMATION: 'CONFIRMATION',
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useAuth();

    // Get the passed orderId from navigation state
    const passedOrderId = location.state?.orderId;

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);

    const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEPS.REVIEW_ORDER);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('');
    const [paymentInitiationResponse, setPaymentInitiationResponse] = useState(null);
    const [paymentProcessingMessage, setPaymentProcessingMessage] = useState('');

    // Fetch order info if orderId was passed (Pay Now from OrderPage)
    useEffect(() => {
        const initializeCheckout = async () => {
            if (user && passedOrderId) {
                setIsLoading(true);
                try {
                    const order = await OrderService.getOrderById(passedOrderId);
                    if (order.status === 'PENDING_PAYMENT') {
                        setCreatedOrder(order);
                        setCartTotal(order.totalAmount);
                        setCheckoutStep(CHECKOUT_STEPS.SELECT_PAYMENT);
                    } else {
                        setError("This order cannot be paid. It may already be completed or canceled.");
                    }
                } catch (err) {
                    console.error("Failed to load order:", err);
                    setError("Failed to load order. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initializeCheckout();
    }, [user, passedOrderId]);

    // If no orderId passed, fallback to normal cart-based flow
    useEffect(() => {
        const fetchCartDetails = async () => {
            setIsLoading(true);
            setError(''); // Clear previous errors at the start of fetching
            try {
                const cartData = await CartService.getAllCartItems();

                if (cartData && Array.isArray(cartData) && cartData.length > 0) {
                    // Corrected line: use item.price directly
                    const total = cartData.reduce((sum, item) => {
                        // Ensure price and quantity are valid numbers
                        const price = parseFloat(item.price);
                        const quantity = parseInt(item.quantity, 10);
                        if (!isNaN(price) && !isNaN(quantity)) {
                            return sum + (price * quantity);
                        }
                        console.warn("Invalid price or quantity for item:", item);
                        return sum;
                    }, 0);

                    setCartTotal(total);
                    setCartItemCount(cartData.reduce((count, item) => {
                        const quantity = parseInt(item.quantity, 10);
                        return count + (isNaN(quantity) ? 0 : quantity);
                    }, 0));
                } else {
                    setCartTotal(0);
                    setCartItemCount(0);
                    // This error is for an empty cart, not a loading failure.
                    if (checkoutStep === CHECKOUT_STEPS.REVIEW_ORDER) {
                        setError("Your cart is empty. Please add items to your cart.");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch cart details for checkout:", err);
                setError("Could not load cart details. Please try again."); // This error is for loading failures.
            } finally {
                setIsLoading(false);
            }
        };

        if (user && !passedOrderId) {
            fetchCartDetails();
        } else if (!user) {
            navigate('/login');
        }
    }, [user, navigate, checkoutStep, passedOrderId]);

    // Create order from cart and go to payment step
    const handlePlaceOrderAndProceedToPayment = async () => {
        if (cartItemCount === 0) {
            setError("Cannot place an order with an empty cart.");
            return;
        }
        setError('');
        setIsLoading(true);
        setPaymentProcessingMessage('Creating your order...');

        try {
            const order = await OrderService.createOrderFromCart();
            setCreatedOrder(order);
            setCartTotal(order.totalAmount);
            setCheckoutStep(CHECKOUT_STEPS.SELECT_PAYMENT);
            setPaymentProcessingMessage('');
        } catch (err) {
            console.error('Error placing order:', err);
            setError(`Failed to place order: ${err.message || 'An unknown error occurred.'}`);
            setPaymentProcessingMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    // Select and initiate payment gateway (Stripe or COD)
    const handlePaymentGatewaySelection = async (gateway) => {
        if (!createdOrder) {
            setError("Order not created yet. Please try placing the order again.");
            return;
        }
        setSelectedPaymentGateway(gateway);
        setIsLoading(true);
        setError('');
        setPaymentProcessingMessage(`Initiating ${gateway === 'STRIPE' ? 'Stripe' : 'Cash On Delivery'} payment...`);

        try {
            console.log("User object in handlePaymentGatewaySelection:", user);
            if (!user || !token) {
                console.error("Auth token missing. User:", user, "Token:", token);
                throw new Error("User authentication token is missing.");
            }
            const paymentResponse = await PaymentService.initiatePayment(createdOrder.orderId, gateway, token);
            setPaymentInitiationResponse(paymentResponse);
            setCheckoutStep(CHECKOUT_STEPS.PROCESS_PAYMENT);
            setPaymentProcessingMessage('');
        } catch (err) {
            console.error(`Error initiating ${gateway} payment:`, err);
            setError(`Failed to initiate ${gateway} payment: ${err.message || 'Please try again.'}`);
            setPaymentProcessingMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle successful Stripe payment
    const handleStripePaymentSuccess = (stripePaymentIntent) => {
        setPaymentProcessingMessage(`Stripe payment successful! Transaction ID: ${stripePaymentIntent.id}. Finalizing order...`);
        setCheckoutStep(CHECKOUT_STEPS.CONFIRMATION);
        setError('');
    };

    // Handle Stripe error
    const handleStripePaymentError = (errorMessage) => {
        setError(`Stripe Payment Failed: ${errorMessage}. Please try a different payment method or contact support.`);
        setPaymentProcessingMessage('');
        setCheckoutStep(CHECKOUT_STEPS.SELECT_PAYMENT);
        setPaymentInitiationResponse(null);
    };

    // Handle COD success
    const handleCODSuccess = () => {
        setPaymentProcessingMessage("Cash On Delivery order confirmed!");
        setCheckoutStep(CHECKOUT_STEPS.CONFIRMATION);
        setError('');
    };

    const navigateToOrders = () => {
        navigate('/order');
    };

    // If user is not logged in
    if (!user && !isLoading) {
        return <div className="p-4 text-center">Redirecting to login...</div>;
    }

    if (isLoading && checkoutStep === CHECKOUT_STEPS.REVIEW_ORDER && cartItemCount === 0 && !createdOrder) {
        return <div className="p-4 text-center">Loading checkout details...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

            {paymentProcessingMessage && !error && (
                <div className="p-3 mb-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-md animate-pulse">
                    {paymentProcessingMessage}
                </div>
            )}

            {/* Show error */}
            {error && !(checkoutStep === CHECKOUT_STEPS.REVIEW_ORDER && cartItemCount === 0 && error.includes("Your cart is empty")) && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                    Error: {error}
                </div>
            )}

            {checkoutStep === CHECKOUT_STEPS.REVIEW_ORDER && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Review Your Order</h2>
                    {cartItemCount > 0 ? (
                        <>
                            <p className="text-lg mb-2">Items in cart: <span className="font-semibold">{cartItemCount}</span></p>
                            <p className="text-xl mb-6">Total Amount: <span className="font-bold text-green-600">${cartTotal.toFixed(2)}</span></p>
                            <button
                                onClick={handlePlaceOrderAndProceedToPayment}
                                disabled={isLoading || cartItemCount === 0}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Placing Order...' : 'Place Order & Proceed to Payment'}
                            </button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg mb-4">
                                {error && error.includes("Your cart is empty") ? error : "Your cart is currently empty."}
                            </p>
                            <button onClick={() => navigate('/products')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Select Payment */}
            {checkoutStep === CHECKOUT_STEPS.SELECT_PAYMENT && createdOrder && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-700">Order Placed (ID: {createdOrder.orderId})</h2>
                    <p className="text-lg mb-1">Status: <span className="font-medium">{createdOrder.status || 'PENDING_PAYMENT'}</span></p>
                    <p className="text-xl mb-6">Total Due: <span className="font-bold text-green-600">${createdOrder.totalAmount.toFixed(2)}</span></p>
                    <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-700">Select Payment Method</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => handlePaymentGatewaySelection('STRIPE')}
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-60"
                        >
                            {isLoading && selectedPaymentGateway === 'STRIPE' ? 'Processing...' : 'Pay with Card (Stripe)'}
                        </button>
                        <button
                            onClick={() => handlePaymentGatewaySelection('COD')}
                            disabled={isLoading}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-60"
                        >
                            {isLoading && selectedPaymentGateway === 'COD' ? 'Processing...' : 'Cash On Delivery'}
                        </button>
                    </div>
                </div>
            )}

            {/* Process Payment */}
            {checkoutStep === CHECKOUT_STEPS.PROCESS_PAYMENT && paymentInitiationResponse && createdOrder && (
                <div>
                    {selectedPaymentGateway === 'STRIPE' && (
                        <StripeCheckoutForm
                            clientSecret={paymentInitiationResponse.clientSecret}
                            orderId={createdOrder.orderId}
                            orderAmount={createdOrder.totalAmount}
                            onPaymentSuccess={handleStripePaymentSuccess}
                            onPaymentError={handleStripePaymentError}
                        />
                    )}
                    {selectedPaymentGateway === 'COD' && (
                        <CODCheckoutForm
                            orderId={createdOrder.orderId}
                            transactionId={paymentInitiationResponse.transactionId}
                            orderStatus={paymentInitiationResponse.orderStatus || createdOrder.status}
                            orderAmount={createdOrder.totalAmount}
                            onConfirmCOD={handleCODSuccess}
                        />
                    )}
                </div>
            )}

            {/* Confirmation */}
            {checkoutStep === CHECKOUT_STEPS.CONFIRMATION && createdOrder && (
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">Thank You! Your Order is Confirmed!</h2>
                    <p className="text-lg text-gray-700 mb-2">Order ID: <span className="font-medium">{createdOrder.orderId}</span></p>
                    <p className="text-gray-600 mb-6">
                        {selectedPaymentGateway === 'STRIPE' ?
                            "Your payment was successful. We've received your order and will process it shortly." :
                            "Your order for Cash On Delivery has been confirmed. We will contact you for delivery."
                        }
                    </p>
                    <button
                        onClick={navigateToOrders}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                    >
                        View My Orders
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;

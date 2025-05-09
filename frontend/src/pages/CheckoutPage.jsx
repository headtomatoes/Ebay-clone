// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import OrderService from '../services/OrderService';
// import CartService from '../services/CartService'; // To get cart total or clear cart
// import { useAuth } from '../contexts/AuthContext';
//
// const CheckoutPage = () => {
//     const navigate = useNavigate();
//     const { user } = useAuth();
//
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [cartTotal, setCartTotal] = useState(0);
//     const [cartItemCount, setCartItemCount] = useState(0);
//
//
//     useEffect(() => {
//         const fetchCartDetails = async () => {
//             setIsLoading(true);
//             try {
//                 const cartData = await CartService.getAllCartItems();
//                 if (cartData && Array.isArray(cartData)) {
//                     const total = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//                     setCartTotal(total);
//                     setCartItemCount(cartData.reduce((count, item) => count + item.quantity, 0));
//                 } else {
//                     setCartTotal(0);
//                     setCartItemCount(0);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch cart details for checkout:", err);
//                 setError("Could not load cart details. Please try again.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//
//         if (user) {
//             fetchCartDetails();
//         } else {
//             navigate('/login'); // Redirect if not logged in
//         }
//     }, [user, navigate]);
//
//     const handlePlaceOrder = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsLoading(true);
//
//         try {
//             // Call the simplified createOrderFromCart which doesn't require address details upfront
//             const createdOrder = await OrderService.createOrderFromCart();
//
//             // The backend should handle clearing the cart after successful order creation.
//             // If CartService.clearCart() is still needed on the frontend, ensure it's called.
//             // For now, we assume backend handles it.
//
//             alert(`Order placed successfully! Order ID: ${createdOrder.orderId}. You will be redirected to your orders page.`);
//             navigate('/order'); // Navigate to the order history page
//         } catch (err) {
//             console.error('Error placing order:', err);
//             setError(`Failed to place order: ${err.message || 'An unknown error occurred.'}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     if (!user && !isLoading) { // Avoid brief flash of "Redirecting" if user is quickly available
//         return <div className="p-4 text-center">Redirecting to login...</div>;
//     }
//
//     if (isLoading && cartItemCount === 0) { // Show loading only if we haven't determined cart state
//         return <div className="p-4 text-center">Loading checkout details...</div>;
//     }
//
//     if (!isLoading && cartItemCount === 0) {
//         return (
//             <div className="container mx-auto p-4 max-w-2xl text-center">
//                 <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//                 <p className="text-lg mb-4">Your cart is empty.</p>
//                 <p className="mb-6">Please add items to your cart before proceeding to checkout.</p>
//                 <button onClick={() => navigate('/products')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Shop Products
//                 </button>
//             </div>
//         );
//     }
//
//     return (
//         <div className="container mx-auto p-4 max-w-2xl">
//             <h1 className="text-3xl font-bold mb-6 text-center">Review Your Order</h1>
//
//             <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//                 <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
//                 <p className="text-lg mb-1">Items in cart: <span className="font-semibold">{cartItemCount}</span></p>
//                 <p className="text-lg">Total Amount: <span className="font-bold">${cartTotal.toFixed(2)}</span></p>
//                 <p className="text-sm text-gray-500 mt-2">Shipping and billing details will be confirmed at a later step (e.g., during payment).</p>
//             </div>
//
//             {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}
//
//             {/* Placeholder for future Payment Section - can be minimal for now */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment</h3>
//                 <p className="text-sm text-gray-500">
//                     Proceeding will create your order with 'Pending Payment' status.
//                     Payment processing will be handled subsequently.
//                 </p>
//             </div>
//
//             <form onSubmit={handlePlaceOrder}>
//                 <button
//                     type="submit"
//                     disabled={isLoading || cartItemCount === 0}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
//                 >
//                     {isLoading ? 'Placing Order...' : 'Confirm and Place Order'}
//                 </button>
//             </form>
//         </div>
//     );
// };
//
// export default CheckoutPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import CartService from '../services/CartService';
import PaymentService from '../services/PaymentService';
import { useAuth } from '../contexts/AuthContext';
import StripeCheckoutForm from '../components/payments/StripeCheckoutForm';
import CODCheckoutForm from '../components/payments/CODCheckoutForm';

const CHECKOUT_STEPS = {
    REVIEW_ORDER: 'REVIEW_ORDER',
    SELECT_PAYMENT: 'SELECT_PAYMENT',
    PROCESS_PAYMENT: 'PROCESS_PAYMENT',
    CONFIRMATION: 'CONFIRMATION',
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user , token} = useAuth();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);

    const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEPS.REVIEW_ORDER);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('');
    const [paymentInitiationResponse, setPaymentInitiationResponse] = useState(null);
    const [paymentProcessingMessage, setPaymentProcessingMessage] = useState('');


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

        if (user) {
            fetchCartDetails();
        } else {
            navigate('/login');
        }
    }, [user, navigate, checkoutStep]);

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
            if (!user || !token) { // Check the 'token' variable destructured from useAuth()
                console.error("Auth token missing. User:", user, "Token:", token); // Good for debugging
                throw new Error("User authentication token is missing.");
            }
            const paymentResponse = await PaymentService.initiatePayment(createdOrder.orderId, gateway, token); // Pass the 'token' variable
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

    const handleStripePaymentSuccess = (stripePaymentIntent) => {
        setPaymentProcessingMessage(`Stripe payment successful! Transaction ID: ${stripePaymentIntent.id}. Finalizing order...`);
        setCheckoutStep(CHECKOUT_STEPS.CONFIRMATION);
        setError('');
    };

    const handleStripePaymentError = (errorMessage) => {
        setError(`Stripe Payment Failed: ${errorMessage}. Please try a different payment method or contact support.`);
        setPaymentProcessingMessage('');
        setCheckoutStep(CHECKOUT_STEPS.SELECT_PAYMENT);
        setPaymentInitiationResponse(null);
    };

    const handleCODSuccess = () => {
        setPaymentProcessingMessage("Cash On Delivery order confirmed!");
        setCheckoutStep(CHECKOUT_STEPS.CONFIRMATION);
        setError('');
    };

    const navigateToOrders = () => {
        navigate('/order');
    };

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
            {/* Display error only if it's not the "cart is empty" message during review step when cart is actually empty */}
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
                            {/* Show the "cart is empty" message from error state, or a default one if error is different */}
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

            {checkoutStep === CHECKOUT_STEPS.CONFIRMATION && createdOrder &&(
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
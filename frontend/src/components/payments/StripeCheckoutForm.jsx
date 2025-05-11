import React, { useState, useEffect } from 'react';

// For real Stripe:
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// const stripePromise = loadStripe('your-stripe-publishable-key'); // Replace with your actual key

const StripeCheckoutForm = ({ clientSecret, orderId, orderAmount, onPaymentSuccess, onPaymentError }) => {
    // const stripe = useStripe(); // For real Stripe
    // const elements = useElements(); // For real Stripe
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);

    useEffect(() => {
        if (!clientSecret) {
            setError("Stripe client secret is missing. Cannot proceed with payment.");
        }
    }, [clientSecret]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!clientSecret) {
            setError("Cannot process payment: Stripe client secret is not available.");
            return;
        }

        setProcessing(true);
        setError(null);

        // console.log(`Simulating Stripe payment for Order ID: ${orderId}, Amount: ${orderAmount}, CS: ${clientSecret}`);

        // MOCKING STRIPE CONFIRMATION
        setTimeout(() => {
            // Simulate success or failure
            const isMockSuccess = Math.random() > 0.1; // 90% success rate

            if (isMockSuccess) {
                const mockPaymentIntent = { id: `pi_mock_${Date.now()}`, status: 'succeeded', orderId };
                // console.log("StripeCheckoutForm: Mock paymentIntent successful", mockPaymentIntent);
                setSucceeded(true);
                setProcessing(false);
                onPaymentSuccess(mockPaymentIntent);
            } else {
                const mockStripeError = { message: "Mock Stripe Payment Failed. Please try again." };
                // console.error("StripeCheckoutForm: Mock paymentIntent error", mockStripeError);
                setError(mockStripeError.message);
                setProcessing(false);
                onPaymentError(mockStripeError.message);
            }
        }, 2000); // Simulate network delay
    };

    if (succeeded) {
        return <p className="text-green-600 font-semibold p-4 bg-green-50 rounded-md">Payment Successful! Your order (ID: {orderId}) is being processed.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold text-gray-800">Complete Your Payment with Stripe</h3>
            <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderId}</span></p>
            <p className="text-sm text-gray-600">Amount: <span className="font-medium">${orderAmount ? orderAmount.toFixed(2) : 'N/A'}</span></p>

            {/* In a real app, Stripe's CardElement would go here */}
            <div className="p-3 my-3 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-700">[Simulated Stripe Card Element Area]</p>
                <p className="text-xs text-gray-500 mt-1">Your card details would be entered here securely.</p>
            </div>

            <button
                type="submit"
                disabled={processing || succeeded || !clientSecret}
                className="w-full px-4 py-2.5 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                {processing ? "Processing Payment..." : `Pay $${orderAmount ? orderAmount.toFixed(2) : 'Amount'}`}
            </button>
            {error && <p className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md">{error}</p>}
            {!clientSecret && !error && (
                <p className="text-yellow-600 text-sm mt-2 p-2 bg-yellow-50 rounded-md">
                    Waiting for Stripe payment details to load...
                </p>
            )}
        </form>
    );
};

// For real Stripe, you'd wrap the component that uses useStripe and useElements in <Elements>
// Example:
// const StripeCheckoutFormWrapper = (props) => (
//   <Elements stripe={stripePromise}>
//     <StripeCheckoutForm {...props} />
//   </Elements>
// );
// export default StripeCheckoutFormWrapper;

export default StripeCheckoutForm; // Using mock for now
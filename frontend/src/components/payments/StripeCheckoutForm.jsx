import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your REAL Stripe publishable key
const stripePromise = loadStripe('pk_test_51RRpcQHM7UpsjLOhTA9DVtCdu5cZWwv4Cv6mBnOdclBcQtHmz1iXgpPq7HUqMzqwi56K5DAQet2nco7qMQLr0aiM00dDeR8eN6');

const StripeCheckoutFormWrapped = (props) => (
    <Elements stripe={stripePromise}>
        <StripeCheckoutForm {...props} />
    </Elements>
);

const StripeCheckoutForm = ({ clientSecret, orderId, orderAmount, onPaymentSuccess, onPaymentError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);

    useEffect(() => {
        if (!clientSecret && !processing) { // Don't show if already processing
            setError("Stripe client secret is missing. Cannot initialize payment form.");
        } else if (clientSecret) {
            setError(null); // Clear error if clientSecret becomes available
        }
    }, [clientSecret, processing]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            setError("Stripe.js has not loaded yet. Please wait a moment.");
            return;
        }

        if (!clientSecret) {
            setError("Cannot process payment: Stripe client secret is not available.");
            console.error("Attempted payment submission without clientSecret.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card element not found. Please ensure the form is set up correctly.");
            console.error("CardElement not found in elements.");
            return;
        }

        setProcessing(true);
        setError(null);
        setSucceeded(false);

        console.log(`Attempting real Stripe payment for Order ID: ${orderId}, Amount: ${orderAmount}, CS: ${clientSecret}`);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret, // The client secret obtained from your server
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                // Show error to your customer (e.g., insufficient funds, card declined)
                console.error("StripeCheckoutForm: Stripe API error", stripeError);
                setError(stripeError.message || "An unexpected error occurred.");
                setProcessing(false);
                if (onPaymentError) onPaymentError(stripeError.message || "An unexpected error occurred.");
                return;
            }

            // PaymentIntent successfully processed
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log("StripeCheckoutForm: Real PaymentIntent successful!", paymentIntent);
                setSucceeded(true);
                setProcessing(false);
                if (onPaymentSuccess) onPaymentSuccess(paymentIntent);
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // Handle 3D Secure or other actions if needed
                // Stripe.js will automatically handle redirection for most 'requires_action' scenarios
                // if `handleActions: true` (default).
                // You might want to inform the user that further action is needed.
                console.log("StripeCheckoutForm: PaymentIntent requires action", paymentIntent);
                setError("Further action is required to complete your payment. Please follow the prompts.");
                // setProcessing(false); // Keep processing true if Stripe handles redirection
            } else {
                // Other statuses (e.g., processing, requires_capture if you use manual capture)
                console.warn("StripeCheckoutForm: PaymentIntent status not immediately 'succeeded'", paymentIntent);
                // You might want to inform the user that the payment is processing
                // and they will be notified. Or handle based on the specific status.
                setError(`Payment status: ${paymentIntent ? paymentIntent.status : 'unknown'}. We will notify you once confirmed.`);
                setProcessing(false);
                if (onPaymentError) onPaymentError(`Payment status: ${paymentIntent ? paymentIntent.status : 'unknown'}`);
            }

        } catch (e) {
            // Catch any unexpected JS errors during the process
            console.error("StripeCheckoutForm: Unexpected JavaScript error during payment", e);
            setError("An unexpected client-side error occurred. Please try again.");
            setProcessing(false);
            if (onPaymentError) onPaymentError("An unexpected client-side error occurred.");
        }
    };

    if (succeeded) {
        return <p className="text-green-600 font-semibold p-4 bg-green-50 rounded-md">Payment Successful! Your order (ID: {orderId}) is being processed.</p>;
    }

    // Card Element styling
    const cardElementOptions = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        },
        // Hide postal code if not needed for your region/setup
        // hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold text-gray-800">Complete Your Payment with Stripe</h3>
            <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderId}</span></p>
            <p className="text-sm text-gray-600">Amount: <span className="font-medium">${orderAmount ? orderAmount.toFixed(2) : 'N/A'}</span></p>

            <div className="p-3 my-3 border rounded-md bg-gray-50">
                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Details
                </label>
                <CardElement id="card-element" options={cardElementOptions} />
            </div>

            <button
                type="submit"
                disabled={!stripe || !elements || processing || succeeded || !clientSecret}
                className="w-full px-4 py-2.5 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {processing ? "Processing Payment..." : `Pay $${orderAmount ? orderAmount.toFixed(2) : 'Amount'}`}
            </button>
            {error && <p className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md">{error}</p>}
            {!clientSecret && !error && !processing && ( // Only show if not processing and no other error
                <p className="text-yellow-600 text-sm mt-2 p-2 bg-yellow-50 rounded-md">
                    Waiting for payment details to load... Ensure client secret is provided.
                </p>
            )}
        </form>
    );
};

export default StripeCheckoutFormWrapped; // Export the wrapped component
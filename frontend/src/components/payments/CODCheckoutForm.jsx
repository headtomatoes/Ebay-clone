import React from 'react';

const CODCheckoutForm = ({ orderId, transactionId, orderStatus, orderAmount, onConfirmCOD }) => {
    return (
        <div className="p-6 border rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold text-gray-800">Cash On Delivery Confirmed</h3>
            <div className="mt-4 space-y-2 text-gray-700">
                <p>
                    Your order (ID: <span className="font-medium">{orderId}</span>) has been placed successfully.
                </p>
                <p>
                    Payment Method: <span className="font-medium">Cash On Delivery</span>
                </p>
                <p>
                    Amount Due: <span className="font-bold text-lg">${orderAmount ? orderAmount.toFixed(2) : 'N/A'}</span>
                </p>
                {transactionId && (
                    <p>
                        Transaction ID: <span className="font-medium">{transactionId}</span>
                    </p>
                )}
                <p>
                    Order Status: <span className="font-medium">{orderStatus || 'Processing'}</span>
                </p>
            </div>
            <p className="mt-5 text-sm text-gray-600">
                Please keep the exact amount of <span className="font-semibold">${orderAmount ? orderAmount.toFixed(2) : 'the total'}</span> ready for payment upon delivery.
                Our team will contact you shortly to confirm delivery details.
            </p>
            <button
                onClick={onConfirmCOD}
                className="mt-6 w-full px-4 py-2.5 text-white font-semibold bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
                Track Your Order / View Order Details
            </button>
        </div>
    );
};

export default CODCheckoutForm;
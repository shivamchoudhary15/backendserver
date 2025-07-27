// src/pages/DashboardPayment.js
import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { createPayment } from '../api/api'; // Assuming you have this API

// You might want to reuse/adapt your existing Payment.js CSS here
import './PaymentPage.css'; // Create this CSS file if it doesn't exist or reuse existing

export default function DashboardPayment() {
  const { user, navigate } = useOutletContext();
  const location = useLocation();
  const { cartItems } = location.state || {}; // Get cart items if passed from checkout

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setPaymentAmount(total);
      setPaymentStatus('Ready to pay for cart items.');
    } else {
      setPaymentAmount(0); // Or get from another source if not cart
      setPaymentStatus('No items to pay for directly. Please book a puja first.');
    }
  }, [cartItems]);

  const handlePayment = async () => {
    if (paymentAmount <= 0) {
      setPaymentStatus('Please add items to your cart or select a puja to proceed with payment.');
      return;
    }

    setLoading(true);
    setPaymentStatus('Processing payment...');
    try {
      // Dummy payment logic for demonstration
      // In a real app, this would involve integrating with a payment gateway (e.g., Stripe, Razorpay)
      // and sending a payment token or intent to your backend.
      const paymentData = {
        userId: user?._id,
        amount: paymentAmount,
        currency: 'INR',
        description: cartItems ? 'Cart Payment' : 'Direct Puja Payment',
        items: cartItems?.map(item => ({ serviceId: item._id, quantity: item.quantity, price: item.price }))
      };

      const res = await createPayment(paymentData); // Call your backend payment API
      if (res.data.success) {
        setPaymentStatus('Payment successful! Redirecting to booking history...');
        // Clear cart after successful payment if applicable (e.g., by calling setCartItems([]) from context)
        // navigate('/dashboard/booking-history'); // Redirect after successful payment
      } else {
        setPaymentStatus('Payment failed: ' + (res.data.message || 'Unknown error.'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment failed: ' + (error.response?.data?.message || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <h2>Make a Payment</h2>
        <p className="payment-status-message">{paymentStatus}</p>

        <div className="payment-details">
          <p><strong>Amount Due:</strong> ₹{paymentAmount.toLocaleString('en-IN')}</p>
          {cartItems && cartItems.length > 0 && (
            <div className="cart-summary-for-payment">
              <h4>Items in Cart:</h4>
              <ul>
                {cartItems.map(item => (
                  <li key={item._id}>{item.name} x {item.quantity} (₹{item.price.toLocaleString('en-IN')})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          className="pay-now-btn custom-btn glow-btn"
          onClick={handlePayment}
          disabled={loading || paymentAmount <= 0}
        >
          {loading ? 'Processing...' : `Pay Now ₹${paymentAmount.toLocaleString('en-IN')}`}
        </button>
      </div>
    </div>
  );
}

// src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBooking, getVerifiedPandits } from '../api/api';
import './BookingPage.css'; // Create a new CSS file for this page

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPooja, cartItems, festival } = location.state || {}; // Get state from navigation

  const [pandits, setPandits] = useState([]);
  const [formData, setFormData] = useState({
    userId: '', // Will be populated from localStorage
    serviceId: selectedPooja?._id || '',
    panditId: '',
    puja_date: '',
    puja_time: '',
    customer_name: '',
    phone_number: '',
    location: '', // Using 'location' for address as per API
    additional_info: festival ? `Booking for ${festival} festival.` : '',
    total_amount: cartItems ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : (selectedPooja?.price || 0),
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user._id,
        customer_name: user.name,
        phone_number: user.phone || '', // Assuming phone might be in user data
      }));
    }
    getVerifiedPandits().then((res) => {
      setPandits(res.data || []);
    }).catch(err => console.error("Failed to load pandits:", err));

    // Pre-fill if coming from cart or "Book Now"
    if (cartItems && cartItems.length > 0) {
      // For simplicity, if multiple items in cart, we'll book them as one "cart booking" or require individual bookings
      // For now, let's just pre-fill total_amount, serviceId can be 'Cart Booking'
      setFormData(prev => ({
        ...prev,
        serviceId: 'cart_booking_placeholder', // Or handle multiple services later
        total_amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }));
      setMessage("Your cart items will be booked together. Please provide details.");
    } else if (selectedPooja) {
      setFormData(prev => ({
        ...prev,
        serviceId: selectedPooja._id,
        total_amount: selectedPooja.price,
      }));
      setMessage(`Booking for: ${selectedPooja.name}`);
    } else if (festival) {
      setMessage(`Booking for: ${festival}`);
    }
  }, [selectedPooja, cartItems, festival]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Adapt `createBooking` to handle either single service or a "cart booking"
      const bookingDataToSend = {
        ...formData,
        // If booking from cart, you might want to send cartItems directly to backend
        // or create separate bookings for each item. This depends on your backend logic.
        // For now, `serviceId` is a single ID.
        // For cart, you'd need a more complex structure or multiple API calls.
        // Here, we assume a simple case where `serviceId` represents the primary puja.
        // You might need to add a `cartItems` array to your bookingData if your backend supports it.
        cartItems: cartItems?.map(item => ({ serviceId: item._id, quantity: item.quantity, price: item.price }))
      };

      if(bookingDataToSend.serviceId === 'cart_booking_placeholder' && cartItems?.length > 0) {
          // This is a simplified way. In a real app, you might iterate and call createBooking for each or have a bulk booking API.
          // For now, we'll just send the first item's serviceId as a placeholder if multiple items are in cart.
          bookingDataToSend.serviceId = cartItems[0]._id;
      }

      const res = await createBooking(bookingDataToSend);
      setMessage('Booking created successfully! Status: ' + res.data.status);
      setFormData({ // Reset form after successful booking
        userId: formData.userId,
        serviceId: '',
        panditId: '',
        puja_date: '',
        puja_time: '',
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        location: '',
        additional_info: '',
        total_amount: 0,
      });
      // Optionally navigate back to dashboard or booking history
      navigate('/dashboard#booking');
    } catch (error) {
      console.error('Booking failed:', error);
      setMessage('Booking failed: ' + (error.response?.data?.message || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page-container">
      <div className="booking-form-card">
        <h2>Book Your Puja</h2>
        {message && <p className="booking-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_name">Your Name:</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Address:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Full address for puja"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceId">Pooja Service:</label>
            <select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Pooja Service</option>
              {/* If coming from cart, show a general "Cart Booking" option or iterate cart items */}
              {cartItems && cartItems.length > 0 ? (
                <option value="cart_booking_placeholder">Cart Booking ({cartItems.length} items)</option>
              ) : (
                selectedPooja && <option value={selectedPooja._id}>{selectedPooja.name}</option>
              )}
              {/* You might want to fetch all poojas here too, if not pre-selected */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="panditId">Preferred Pandit:</label>
            <select
              id="panditId"
              name="panditId"
              value={formData.panditId}
              onChange={handleChange}
            >
              <option value="">No Preference (or Select Pandit)</option>
              {pandits.map((pandit) => (
                <option key={pandit._id} value={pandit._id}>
                  {pandit.name} ({pandit.city})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="puja_date">Puja Date:</label>
            <input
              type="date"
              id="puja_date"
              name="puja_date"
              value={formData.puja_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="puja_time">Puja Time:</label>
            <input
              type="time"
              id="puja_time"
              name="puja_time"
              value={formData.puja_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="additional_info">Additional Info (e.g., specific rituals):</label>
            <textarea
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="total_amount">Total Amount:</label>
            <input
              type="text"
              id="total_amount"
              name="total_amount"
              value={`₹${formData.total_amount.toLocaleString('en-IN')}`}
              disabled
              className="disabled-input"
            />
          </div>

          <button type="submit" className="submit-booking-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking & Pay'}
          </button>
        </form>
        <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

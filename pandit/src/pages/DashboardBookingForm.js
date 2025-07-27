// src/pages/DashboardBookingForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom'; // useOutletContext
import { createBooking } from '../api/api';
import './BookingPage.css'; // Reusing CSS from previous BookingPage.js

export default function DashboardBookingForm() {
  const { user, pandits, poojas, navigate, cartItems } = useOutletContext(); // Get context from Dashboard
  const location = useLocation();
  const { selectedPooja, festival } = location.state || {};

  const [formData, setFormData] = useState({
    userId: user?._id || '',
    serviceId: selectedPooja?._id || '',
    panditId: '',
    puja_date: '',
    puja_time: '',
    customer_name: user?.name || '',
    phone_number: user?.phone || '',
    location: '',
    additional_info: festival ? `Booking for ${festival} festival.` : '',
    total_amount: cartItems ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : (selectedPooja?.price || 0),
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update form data if user or initial selection changes
    setFormData((prev) => ({
      ...prev,
      userId: user?._id || '',
      customer_name: user?.name || '',
      phone_number: user?.phone || '',
      serviceId: selectedPooja?._id || prev.serviceId, // Keep existing if no new selection
      total_amount: cartItems ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : (selectedPooja?.price || prev.total_amount || 0),
      additional_info: festival ? `Booking for ${festival} festival.` : prev.additional_info,
    }));

    if (cartItems && cartItems.length > 0) {
      setMessage("Your cart items will be booked together. Please provide details.");
    } else if (selectedPooja) {
      setMessage(`Booking for: ${selectedPooja.name}`);
    } else if (festival) {
      setMessage(`Booking for: ${festival}`);
    }
  }, [user, selectedPooja, cartItems, festival]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const bookingDataToSend = {
        ...formData,
        cartItems: cartItems?.map(item => ({ serviceId: item._id, quantity: item.quantity, price: item.price }))
      };

      if(bookingDataToSend.serviceId === '' && cartItems?.length > 0) {
          // If no specific service is selected but cart has items, use the first item's ID as primary service
          bookingDataToSend.serviceId = cartItems[0]._id;
      }

      const res = await createBooking(bookingDataToSend);
      setMessage('Booking created successfully! Status: ' + res.data.status);
      setFormData({ // Reset form after successful booking
        userId: user?._id || '',
        serviceId: '',
        panditId: '',
        puja_date: '',
        puja_time: '',
        customer_name: user?.name || '',
        phone_number: user?.phone || '',
        location: '',
        additional_info: '',
        total_amount: 0,
      });
      // Navigate to booking history after successful booking
      navigate('/dashboard/booking-history');
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
              {cartItems && cartItems.length > 0 ? (
                <option value="cart_booking_placeholder">Cart Booking ({cartItems.length} items)</option>
              ) : (
                selectedPooja && <option value={selectedPooja._id}>{selectedPooja.name}</option>
              )}
              {/* List all available poojas from context */}
              {poojas.map(pooja => (
                <option key={pooja._id} value={pooja._id}>{pooja.name}</option>
              ))}
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
              min={new Date().toISOString().split('T')[0]}
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
      </div>
    </div>
  );
}

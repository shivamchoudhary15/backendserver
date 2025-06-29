import React, { useState } from 'react';
import { createPayment } from '../api/api';

function Payment() {
  const [payment, setPayment] = useState({ bookingId: '', amount: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment(payment);
      alert('Payment successful');
    } catch {
      alert('Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Booking ID" onChange={e => setPayment({ ...payment, bookingId: e.target.value })} />
      <input placeholder="Amount" onChange={e => setPayment({ ...payment, amount: e.target.value })} />
      <button type="submit">Pay</button>
    </form>
  );
}

export default Payment;

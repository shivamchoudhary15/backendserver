import React, { useState } from 'react';
import axios from 'axios';

const SendOtpForm = ({ onSent }) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/send-otp', { email });
      setMsg('OTP sent successfully');
      onSent(email); // pass email to next step
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  return (
    <div>
      <h3>Enter Email to Receive OTP</h3>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>
      <p>{msg}</p>
    </div>
  );
};

export default SendOtpForm;

import React, { useState } from 'react';
import axios from 'axios';

const VerifyOtpForm = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');

  const verifyOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp });
      setMsg('OTP verified!');
      onVerified();
    } catch (err) {
      setMsg(err.response?.data?.error || 'OTP verification failed');
    }
  };

  return (
    <div>
      <h3>Enter OTP sent to {email}</h3>
      <input value={otp} onChange={e => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Verify OTP</button>
      <p>{msg}</p>
    </div>
  );
};

export default VerifyOtpForm;

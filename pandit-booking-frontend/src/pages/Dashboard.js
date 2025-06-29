import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user data');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleBookingRedirect = () => {
    navigate('/booking');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/home'); // 👈 redirect to home instead of login
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>

      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p>
            Welcome, <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      )}

      <div>
        <button onClick={handleBookingRedirect}>Book a Service</button>
        <button onClick={handleLogout} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;




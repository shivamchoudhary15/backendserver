import React from 'react';
import { useNavigate } from 'react-router-dom';

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🧘 Pandit Dashboard</h1>

      <div style={styles.card}>
        <h2>🙏 Welcome, {user?.name}</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>City:</strong> {user?.city || 'N/A'}</p>
        <p><strong>Experience:</strong> {user?.experienceYears || 'N/A'} years</p>
        <p><strong>Languages:</strong> {user?.languages || 'N/A'}</p>
        <p><strong>Specialties:</strong> {user?.specialties || 'N/A'}</p>
        <p><strong>Verified:</strong> {user?.is_verified ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div style={styles.actions}>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: 'auto',
    lineHeight: '1.8',
  },
  actions: {
    textAlign: 'center',
    marginTop: '30px',
  },
  logoutBtn: {
    padding: '12px 24px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  }
};

export default PanditDashboard;

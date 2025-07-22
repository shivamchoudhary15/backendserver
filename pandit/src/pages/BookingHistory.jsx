import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllBookings } from '../api/api';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', date: '' });

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await getAllBookings();
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter.status !== 'all' && b.status !== filter.status) return false;
    if (filter.date && !b.date.startsWith(filter.date)) return false;
    return true;
  });

  const statusCounts = filteredBookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Bookings',
        data: Object.values(statusCounts),
        backgroundColor: 'rgba(41, 128, 185, 0.75)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.4rem' }}>Booking History</h2>
      <div style={{ marginBottom: '1.8rem' }}>
        <label style={{ marginRight: '1.4rem' }}>
          Status:{' '}
          <select
            value={filter.status}
            onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Date:{' '}
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter((prev) => ({ ...prev, date: e.target.value }))}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </label>
      </div>

      <Bar data={data} options={{ responsive: true, plugins: { legend: { display: true } } }} />

      <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 3px 10px rgba(0,0,0,0.07)' }}>
          <thead style={{ backgroundColor: '#f6f9fc' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Pandit</th>
              <th style={thStyle}>Devotee</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>
                  No bookings found.
                </td>
              </tr>
            )}
            {filteredBookings.map((b) => (
              <tr key={b._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{b._id}</td>
                <td style={tdStyle}>{b.panditName}</td>
                <td style={tdStyle}>{b.devoteeName}</td>
                <td style={tdStyle}>{new Date(b.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#34495e',
};

const tdStyle = {
  padding: '12px 15px',
  fontSize: '0.9rem',
  color: '#555',
};

export default BookingHistory;

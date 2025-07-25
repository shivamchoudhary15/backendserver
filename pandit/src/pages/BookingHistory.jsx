// src/pages/BookingHistory.jsx
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
import { getBookings } from '../api/api';
import './BookingHistory.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Helper to get week string: YYYY-WW
function getWeekString(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();

  // Get nearest Thursday: ISO week date standard
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);

  // January 4 is always in week 1
  const jan4 = new Date(target.getFullYear(), 0, 4);

  // Number of days between target and jan4
  const dayDiff = (target - jan4) / 86400000;

  // Calculate week number
  const weekNum = 1 + Math.floor(dayDiff / 7);

  return `${year}-W${weekNum.toString().padStart(2, '0')}`;
}

// Helper to get month string: YYYY-MM
function getMonthString(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', date: '' });
  const [timeGroup, setTimeGroup] = useState('month'); // week or month

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await getBookings();
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Normalize a booking's status to class CSS names
  function normalizeStatus(status) {
    if (!status) return 'unknown';
    if (status.toLowerCase() === 'accepted') return 'confirmed';
    return status.toLowerCase();
  }

  // Extract booking date field (use `puja_date` if present, else `date`)
  function getBookingDate(b) {
    return b.puja_date || b.date;
  }

  // Filter bookings based on status & date
  const filteredBookings = bookings.filter(b => {
    if (filter.status !== 'all' && b.status?.toLowerCase() !== filter.status) return false;
    if (filter.date) {
      const bookingDate = getBookingDate(b);
      if (!bookingDate || !bookingDate.startsWith(filter.date)) return false;
    }
    return true;
  });

  // Aggregate bookings counts by status for filtered list (for table and legend)
  const statusCounts = filteredBookings.reduce((acc, b) => {
    const s = normalizeStatus(b.status);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Prepare data aggregation by week or month over ALL bookings for the graph
  // Filtering by status applies for graph too
  const timeCountsMap = {};

  bookings.forEach((b) => {
    if (filter.status !== 'all' && b.status?.toLowerCase() !== filter.status) return;

    const bookingDate = getBookingDate(b);
    if (!bookingDate) return;

    const key = timeGroup === 'week' ? getWeekString(bookingDate) : getMonthString(bookingDate);
    timeCountsMap[key] = (timeCountsMap[key] || 0) + 1;
  });

  // Sort keys (time buckets)
  const sortedKeys = Object.keys(timeCountsMap).sort();

  const data = {
    labels: sortedKeys,
    datasets: [{
      label: `Bookings per ${timeGroup === 'week' ? 'Week' : 'Month'}`,
      data: sortedKeys.map(k => timeCountsMap[k]),
      backgroundColor: 'rgba(41, 128, 185, 0.75)',
      borderRadius: 8,
    }],
  };

  return (
    <div className="booking-history-page">
      <h2>Booking History</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="status-select">Status:</label>
          <select
            id="status-select"
            value={filter.status}
            onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-filter">Date:</label>
          <input
            id="date-filter"
            type="date"
            value={filter.date}
            onChange={e => setFilter(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="time-group">Group By:</label>
          <select
            id="time-group"
            value={timeGroup}
            onChange={e => setTimeGroup(e.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        {loading
          ? <p style={{ textAlign: 'center' }}>Loading...</p>
          : <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    precision: 0,
                  },
                },
              }}
            />
        }
      </div>

      <div className="history-table-container">
        <table className="history-table" aria-label="Bookings table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pandit</th>
              <th>Devotee</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b._id}>
                  <td>{b._id}</td>
                  <td>{b.panditid?.name || 'Unknown'}</td>
                  <td>{b.userid?.name || 'Unknown'}</td>
                  <td>{new Date(getBookingDate(b)).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-label status-${normalizeStatus(b.status)}`}>
                      {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingHistory;

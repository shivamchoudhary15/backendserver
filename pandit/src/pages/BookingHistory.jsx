import React, { useEffect, useState } from 'react';
import { getBookings, getAllPandits, getAllDevotees } from '../api/api';
import './BookingHistory.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [bookingsRes, panditsRes, devoteesRes] = await Promise.all([
        getBookings(),
        getAllPandits(),
        getAllDevotees(),
      ]);
      setBookings(bookingsRes.data.reverse()); // latest first
      setPandits(panditsRes.data);
      setDevotees(devoteesRes.data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  function getPanditName(id) {
    const p = pandits.find(x => x._id === id);
    return p ? p.name : "(unknown)";
  }

  function getDevoteeName(id) {
    const d = devotees.find(x => x._id === id);
    return d ? d.name : "(unknown)";
  }

  return (
    <div className="booking-history-page">
      <h2>Booking History</h2>
      {loading ? <p>Loading bookings...</p> : (
        bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Pandit</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>{b._id.slice(-7).toUpperCase()}</td>
                    <td>{getPanditName(b.panditId)}</td>
                    <td>{getDevoteeName(b.userId)}</td>
                    <td>{b.date ? new Date(b.date).toLocaleDateString() : ''}</td>
                    <td>{b.location || '-'}</td>
                    <td>
                      <span className={`status-label status-${(b.status || '').toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default BookingHistory;

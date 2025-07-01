// src/pages/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../api/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.length === 0 ? (
          <li>No notifications available.</li>
        ) : (
          notifications.map((note) => (
            <li key={note._id}>
              <span style={{ fontWeight: note.read ? 'normal' : 'bold' }}>
                {note.message}
              </span>
              {!note.read && (
                <button onClick={() => handleMarkAsRead(note._id)} style={{ marginLeft: '10px' }}>
                  Mark as Read
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Notifications;


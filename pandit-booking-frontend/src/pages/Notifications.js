import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api/api';

function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const userId = 'YOUR_USER_ID'; // Replace with actual user ID
    getNotifications(userId).then(res => setNotes(res.data));
  }, []);

  return (
    <ul>
      {notes.map(note => <li key={note._id}>{note.message}</li>)}
    </ul>
  );
}

export default Notifications;

import React, { useEffect, useState } from 'react';
import { getAllDevotees } from '../api/api';
import './DevoteesPage.css';

function DevoteesPage() {
  const [devotees, setDevotees] = useState([]);

  useEffect(() => {
    fetchDevotees();
  }, []);

  async function fetchDevotees() {
    try {
      const res = await getAllDevotees();
      setDevotees(res.data);
    } catch (err) {
      console.error('Error fetching devotees:', err);
    }
  }

  return (
    <div className="devotees-page">
      <h2>Devotees List</h2>
      {devotees.length === 0 ? (
        <p>No devotees found.</p>
      ) : (
        <div className="devotees-list">
          {devotees.map(d => (
            <div key={d._id} className="devotee-card">
              <p><strong>{d.name}</strong></p>
              <p>{d.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DevoteesPage;

// src/pages/DevoteesPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllDevotees } from '../api/api';
import './DevoteesPage.css';

function DevoteesPage() {
  const [devotees, setDevotees] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({}); // id -> form data

  useEffect(() => { fetchDevotees(); }, []);

  async function fetchDevotees() {
    try {
      const res = await getAllDevotees();
      setDevotees(res.data);
    } catch (e) { console.error(e); }
  }

  function startEdit(id, d) {
    setExpandedId(id);
    setEditForm({ ...editForm, [id]: { ...d } });
  }

  async function handleSave(id) {
    try {
      // put updated data except name and email
      const { name, email, ...rest } = editForm[id];
      await fetch(`https://localhost:5000/api/users/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      });
      setExpandedId(null);
      fetchDevotees();
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(id, field, value) {
    setEditForm(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  return (
    <div className="devotees-page">
      <h2>Devotees List</h2>
      {devotees.length === 0 ? (
        <p>No devotees found.</p>
      ) : (
        <div className="devotees-list">
          {devotees.map(d => {
            const isExpanded = expandedId === d._id;
            const form = editForm[d._id] || d;
            return (
              <div
                key={d._id}
                className="devotee-card"
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(isExpanded ? null : d._id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedId(isExpanded ? null : d._id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                {!isExpanded ? (
                  <>
                    <p><strong>{d.name}</strong></p>
                    <p>{d.email}</p>
                  </>
                ) : (
                  <>
                    <div className="devotee-field">
                      <label>Name:</label>
                      <input value={form.name} disabled />
                    </div>
                    <div className="devotee-field">
                      <label>Email:</label>
                      <input value={form.email} disabled />
                    </div>
                    <div className="devotee-field">
                      <label>Phone:</label>
                      <input
                        value={form.phone || ''}
                        onChange={e => handleChange(d._id, 'phone', e.target.value)}
                      />
                    </div>
                    <div className="devotee-field">
                      <label>Address:</label>
                      <input
                        value={form.address || ''}
                        onChange={e => handleChange(d._id, 'address', e.target.value)}
                      />
                    </div>
                    <div className="devotee-actions">
                      <button onClick={e => {
                        e.stopPropagation();
                        handleSave(d._id);
                      }}>Save</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DevoteesPage;

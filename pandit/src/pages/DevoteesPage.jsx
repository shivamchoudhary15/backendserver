// src/pages/DevoteesPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllDevotees } from '../api/api';
import './DevoteesPage.css';

function DevoteesPage() {
  const [devotees, setDevotees] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filters, setFilters] = useState({ name: '', city: '' });

  useEffect(() => {
    fetchDevotees();
  }, []);

  async function fetchDevotees() {
    try {
      const res = await getAllDevotees();
      setDevotees(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave(id) {
    try {
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

  // Filter devotees
  const filtered = devotees.filter(d => {
    if (filters.name && !d.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.city && !(d.city && d.city.toLowerCase().includes(filters.city.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="devotees-page">
      <h2>Devotees List</h2>

      <div className="devotees-filters">
        <input
          placeholder="Search by Name"
          value={filters.name}
          onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
          aria-label="Filter devotees by name"
        />
        <input
          placeholder="Filter by City"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          aria-label="Filter devotees by city"
        />
        <button onClick={() => setFilters({ name: '', city: '' })} aria-label="Clear Filters">Clear Filters</button>
      </div>

      {filtered.length === 0 ? (
        <p>No devotees found.</p>
      ) : (
        <div className="devotees-cards-grid">
          {filtered.map(d => {
            const isExpanded = expandedId === d._id;
            const form = editForm[d._id] || d;
            return (
              <div
                key={d._id}
                className={`devotee-card ${isExpanded ? 'expanded' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(isExpanded ? null : d._id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedId(isExpanded ? null : d._id);
                  }
                }}
                aria-expanded={isExpanded}
                aria-label={`Devotee card for ${d.name}`}
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
                      <label>City:</label>
                      <input
                        value={form.city || ''}
                        onChange={e => handleChange(d._id, 'city', e.target.value)}
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
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSave(d._id);
                        }}
                        aria-label={`Save changes for ${d.name}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        aria-label={`Cancel changes for ${d.name}`}
                      >
                        Cancel
                      </button>
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

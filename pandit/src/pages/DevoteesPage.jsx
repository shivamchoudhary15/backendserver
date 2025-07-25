// src/pages/DevoteesPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllDevotees } from '../api/api';
import './DevoteesPage.css';

function DevoteesPage() {
  const [devotees, setDevotees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => { fetchDevotees(); }, []);

  async function fetchDevotees() {
    try {
      const res = await getAllDevotees();
      setDevotees(res.data);
    } catch (_) {}
  }
  function handleEdit(d) {
    setEditId(d._id);
    setForm({ name: d.name, email: d.email });
  }
  async function handleSave() {
    try {
      // Assume an endpoint exists for updating user/admin: `/users/update/:id`
      await fetch(`https://localhost:5000/api/users/update/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditId(null);
      fetchDevotees();
    } catch (_) {}
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
              {editId === d._id ? (
                <>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
                  <button onClick={handleSave}>Save</button>
                  <button onClick={()=>setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>{d.name}</strong></p>
                  <p>{d.email}</p>
                  <button className="edit-btn" onClick={()=>handleEdit(d)}>Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DevoteesPage;

// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchPandits();
    fetchDevotees();
    fetchPoojas();
  }, []);

  const fetchPandits = async () => {
    const res = await fetch('https://backendserver-6-yebf.onrender.com/api/pandits/admin-view');
    setPandits(await res.json());
  };

  const fetchDevotees = async () => {
    const res = await fetch('https://backendserver-6-yebf.onrender.com/api/users/view');
    setDevotees(await res.json());
  };

  const fetchPoojas = async () => {
    const res = await fetch('https://backendserver-6-yebf.onrender.com/api/poojas/view');
    setPoojas(await res.json());
  };

  const verifyPandit = async id => {
    await fetch(`https://backendserver-6-yebf.onrender.com/api/pandits/verify/${id}`, { method: 'PUT' });
    fetchPandits();
  };

  const deletePooja = async id => {
    await fetch(`https://backendserver-6-yebf.onrender.com/api/poojas/delete/${id}`, { method: 'DELETE' });
    fetchPoojas();
  };

  const editPooja = async (id, field, value) => {
    await fetch(`https://backendserver-6-yebf.onrender.com/api/poojas/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchPoojas();
  };

  const createPooja = async () => {
    await fetch(`https://backendserver-6-yebf.onrender.com/api/poojas/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPooja),
    });
    setNewPooja({ name: '', description: '', imageUrl: '' });
    fetchPoojas();
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Pandits</h2>
        {pandits.map(p => (
          <div key={p._id} className="admin-card">
            <p><strong>{p.name}</strong> - {p.email}</p>
            <p>{p.city} | {p.experienceYears} years</p>
            <p>Languages: {p.languages?.join(', ')}</p>
            <p>Specialties: {p.specialties?.join(', ')}</p>
            <p>Bio: {p.bio}</p>
            <p>Status: {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
            {!p.is_verified && <button onClick={() => verifyPandit(p._id)}>Verify</button>}
          </div>
        ))}
      </section>

      <section>
        <h2>Devotees</h2>
        {devotees.map(d => (
          <div key={d._id} className="admin-card">
            <p><strong>{d.name}</strong> - {d.email}</p>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2>Pooja Management</h2>
        <div className="pooja-form">
          <input type="text" placeholder="Name" value={newPooja.name}
            onChange={e => setNewPooja(prev => ({ ...prev, name: e.target.value }))} />
          <input type="text" placeholder="Description" value={newPooja.description}
            onChange={e => setNewPooja(prev => ({ ...prev, description: e.target.value }))} />
          <input type="text" placeholder="Image URL" value={newPooja.imageUrl}
            onChange={e => setNewPooja(prev => ({ ...prev, imageUrl: e.target.value }))} />
          <button onClick={createPooja}>Add Pooja</button>
        </div>
        {poojas.map(p => (
          <div key={p._id} className="admin-card">
            <p>Name: <input defaultValue={p.name}
              onBlur={e => editPooja(p._id, 'name', e.target.value)} /></p>
            <p>Description: <input defaultValue={p.description}
              onBlur={e => editPooja(p._id, 'description', e.target.value)} /></p>
            <p>Image: <input defaultValue={p.imageUrl || ''}
              onBlur={e => editPooja(p._id, 'imageUrl', e.target.value)} /></p>
            <button onClick={() => deletePooja(p._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;

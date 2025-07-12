import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });
  const [panditImg, setPanditImg] = useState({});

  useEffect(fetchAll, []);

  function fetchAll() {
    fetchPandits(); fetchDevotees(); fetchPoojas();
  }

  async function fetchPandits() {
    const res = await fetch('/api/pandits/admin-view');
    setPandits(await res.json());
  }

  async function fetchDevotees() {
    const res = await fetch('/api/users/view');
    setDevotees(await res.json());
  }

  async function fetchPoojas() {
    const res = await fetch('/api/poojas/view');
    setPoojas(await res.json());
  }

  async function verifyPandit(id) {
    await fetch(`/api/pandits/verify/${id}`, { method: 'PUT' });
    fetchPandits();
  }

  async function uploadPanditPhoto(id) {
    if (!panditImg[id]) return;
    const form = new FormData();
    form.append('photo', panditImg[id]);
    await fetch(`/api/pandits/upload/${id}`, { method: 'POST', body: form });
    fetchPandits();
  }

  async function createPooja() {
    await fetch('/api/poojas/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPooja),
    });
    setNewPooja({ name: '', description: '', imageUrl: '' });
    fetchPoojas();
  }

  async function deletePooja(id) {
    await fetch(`/api/poojas/delete/${id}`, { method: 'DELETE' });
    fetchPoojas();
  }

  async function editPooja(id, field, value) {
    await fetch(`/api/poojas/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchPoojas();
  }

  function logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div className="admin-container">
      <button className="logout-btn" onClick={logout}>Logout</button>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Pandits</h2>
        {pandits.map(p => (
          <div key={p._id} className="admin-card">
            {p.profile_photo_url && <img src={p.profile_photo_url} alt={p.name} />}
            <p><strong>{p.name}</strong> – {p.email}</p>
            <p>{p.city} | {p.experienceYears} yrs</p>
            <p>Langs: {Array.isArray(p.languages) ? p.languages.join(', ') : p.languages}</p>
            <p>Specs: {Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties}</p>
            <p>Bio: {p.bio}</p>
            <p>Status: {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>

            {!p.is_verified && <button onClick={() => verifyPandit(p._id)}>Verify</button>}

            <div className="upload-photo">
              <input
                type="file"
                accept="image/*"
                onChange={e => setPanditImg({ ...panditImg, [p._id]: e.target.files[0] })}
              />
              <button onClick={() => uploadPanditPhoto(p._id)}>Upload Photo</button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>Devotees</h2>
        {devotees.map(d => (
          <div key={d._id} className="admin-card">
            <p><strong>{d.name}</strong> – {d.email}</p>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2>Pooja Management</h2>
        <div className="pooja-form">
          <input
            placeholder="Name"
            value={newPooja.name}
            onChange={e => setNewPooja({ ...newPooja, name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={newPooja.description}
            onChange={e => setNewPooja({ ...newPooja, description: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={newPooja.imageUrl}
            onChange={e => setNewPooja({ ...newPooja, imageUrl: e.target.value })}
          />
          <button onClick={createPooja}>Add Pooja</button>
        </div>

        {poojas.map(pj => (
          <div key={pj._id} className="admin-card">
            <p>Name: <input defaultValue={pj.name} onBlur={e => editPooja(pj._id, 'name', e.target.value)} /></p>
            <p>Description: <input defaultValue={pj.description} onBlur={e => editPooja(pj._id, 'description', e.target.value)} /></p>
            <p>Image: <input defaultValue={pj.imageUrl || ''} onBlur={e => editPooja(pj._id, 'imageUrl', e.target.value)} /></p>
            <button onClick={() => deletePooja(pj._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;

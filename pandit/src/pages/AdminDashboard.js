import React, { useEffect, useState } from 'react';
import {
  getAllPandits,
  verifyPandit,
  uploadPanditPhoto,
  getAllDevotees,
  getAllPoojas,
  addPooja,
  deletePooja,
  updatePooja
} from '../api/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });
  const [panditImg, setPanditImg] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [p, d, pj] = await Promise.all([
        getAllPandits(),
        getAllDevotees(),
        getAllPoojas()
      ]);
      setPandits(p.data);
      setDevotees(d.data);
      setPoojas(pj.data);
    } catch (err) {
      console.error('Error loading data', err);
    }
  }

  async function handleVerify(id) {
    await verifyPandit(id);
    fetchAll();
  }

  async function handlePhotoUpload(id) {
    if (!panditImg[id]) return;
    const form = new FormData();
    form.append('photo', panditImg[id]);
    await uploadPanditPhoto(id, form);
    fetchAll();
  }

  async function handlePoojaCreate() {
    await addPooja(newPooja);
    setNewPooja({ name: '', description: '', imageUrl: '' });
    fetchAll();
  }

  async function handlePoojaDelete(id) {
    await deletePooja(id);
    fetchAll();
  }

  async function handlePoojaEdit(id, field, value) {
    await updatePooja(id, { [field]: value });
    fetchAll();
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

            {!p.is_verified && <button onClick={() => handleVerify(p._id)}>Verify</button>}

            <div className="upload-photo">
              <input
                type="file"
                accept="image/*"
                onChange={e => setPanditImg({ ...panditImg, [p._id]: e.target.files[0] })}
              />
              <button onClick={() => handlePhotoUpload(p._id)}>Upload Photo</button>
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
          <button onClick={handlePoojaCreate}>Add Pooja</button>
        </div>

        {poojas.map(pj => (
          <div key={pj._id} className="admin-card">
            <p>Name: <input defaultValue={pj.name} onBlur={e => handlePoojaEdit(pj._id, 'name', e.target.value)} /></p>
            <p>Description: <input defaultValue={pj.description} onBlur={e => handlePoojaEdit(pj._id, 'description', e.target.value)} /></p>
            <p>Image: <input defaultValue={pj.imageUrl || ''} onBlur={e => handlePoojaEdit(pj._id, 'imageUrl', e.target.value)} /></p>
            <button onClick={() => handlePoojaDelete(pj._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;

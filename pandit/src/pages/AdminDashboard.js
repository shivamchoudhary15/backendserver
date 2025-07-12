import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const BASE_URL = 'https://backendserver-1-ffjl.onrender.com/api';

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
      const [pRes, dRes, poojaRes] = await Promise.all([
        axios.get(`${BASE_URL}/pandits/admin-view`),
        axios.get(`${BASE_URL}/users/view`),
        axios.get(`${BASE_URL}/poojas/view`)
      ]);
      setPandits(pRes.data);
      setDevotees(dRes.data);
      setPoojas(poojaRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  async function verifyPandit(id) {
    await axios.put(`${BASE_URL}/pandits/verify/${id}`);
    fetchAll();
  }

  async function uploadPanditPhoto(id) {
    if (!panditImg[id]) return;
    const form = new FormData();
    form.append('photo', panditImg[id]);
    await axios.post(`${BASE_URL}/pandits/upload/${id}`, form);
    fetchAll();
  }

  async function createPooja() {
    await axios.post(`${BASE_URL}/poojas/add`, newPooja);
    setNewPooja({ name: '', description: '', imageUrl: '' });
    fetchAll();
  }

  async function deletePooja(id) {
    await axios.delete(`${BASE_URL}/poojas/delete/${id}`);
    fetchAll();
  }

  async function editPooja(id, field, value) {
    await axios.put(`${BASE_URL}/poojas/update/${id}`, { [field]: value });
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

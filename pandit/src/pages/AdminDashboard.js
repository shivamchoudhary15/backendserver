import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });
  const [panditImg, setPanditImg] = useState({}); // { panditId: file }

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    fetchPandits(); fetchDevotees(); fetchPoojas();
  };

  const fetchPandits = async () => {
    const res = await fetch('/api/pandits/admin-view');
    setPandits(await res.json());
  };
  const fetchDevotees = async () => {
    const res = await fetch('/api/users/view');
    setDevotees(await res.json());
  };
  const fetchPoojas = async () => {
    const res = await fetch('/api/poojas/view');
    setPoojas(await res.json());
  };

  const verifyPandit = async id => {
    await fetch(`/api/pandits/verify/${id}`, { method: 'PUT' });
    fetchPandits();
  };

  // Upload pandit photo
  const uploadPanditPhoto = async (id) => {
    if (!panditImg[id]) return;
    const form = new FormData();
    form.append('photo', panditImg[id]);
    await fetch(`/api/pandits/upload/${id}`, {
      method: 'POST',
      body: form
    });
    fetchPandits();
  };

  const deletePooja = async id => {
    await fetch(`/api/poojas/delete/${id}`, { method: 'DELETE' });
    fetchPoojas();
  };

  const editPooja = async (id, field, value) => {
    await fetch(`/api/poojas/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchPoojas();
  };

  const createPooja = async () => {
    await fetch('/api/poojas/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPooja),
    });
    setNewPooja({ name: '', description: '', imageUrl: '' });
    fetchPoojas();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

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
            <p>Languages: {p.languages?.join(', ')}</p>
            <p>Specialties: {p.specialties?.join(', ')}</p>
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
            type="text"
            placeholder="Name"
            value={newPooja.name}
            onChange={e => setNewPooja({ ...newPooja, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newPooja.description}
            onChange={e => setNewPooja({ ...newPooja, description: e.target.value })}
          />
          <input
            type="text"
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

import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pandits, setPandits] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchPandits();
    fetchDevotees();
    fetchPoojas();
  }, []);

  async function fetchPandits() {
    const res = await fetch('http://localhost:5000/api/pandits/admin-view');
    setPandits(await res.json());
  }

  async function fetchDevotees() {
    const res = await fetch('http://localhost:5000/api/users/admin-view');
    setDevotees(await res.json());
  }

  async function fetchPoojas() {
    const res = await fetch('http://localhost:5000/api/poojas/view');
    setPoojas(await res.json());
  }

  const verifyPandit = async id => {
    await fetch(`http://localhost:5000/api/pandits/verify/${id}`, { method: 'PUT' });
    fetchPandits();
  };

  const deletePooja = async id => {
    await fetch(`http://localhost:5000/api/poojas/delete/${id}`, { method: 'DELETE' });
    fetchPoojas();
  };

  const editPooja = async (id, field, value) => {
    await fetch(`http://localhost:5000/api/poojas/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchPoojas();
  };

  const createPooja = async () => {
    await fetch('http://localhost:5000/api/poojas/add', {
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
        <h2>Registrations</h2>
        <div className="admin-subsection">
          <div>
            <h3>Pandits</h3>
            {pandits.map(p => (
              <div key={p._id} className="admin-card">
                <p><strong>{p.name}</strong> - {p.email}</p>
                <p>Status: {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
                {!p.is_verified && (
                  <button onClick={() => verifyPandit(p._id)}>Verify</button>
                )}
              </div>
            ))}
          </div>
          <div>
            <h3>Devotees</h3>
            {devotees.map(d => (
              <div key={d._id} className="admin-card">
                <p><strong>{d.name}</strong> - {d.email}</p>
              </div>
            ))}
          </div>
        </div>
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
        {poojas.map(p => (
          <div key={p._id} className="admin-card">
            <p>Name: <input defaultValue={p.name} onBlur={e => editPooja(p._id, 'name', e.target.value)} /></p>
            <p>Description: <input defaultValue={p.description} onBlur={e => editPooja(p._id, 'description', e.target.value)} /></p>
            <p>Image: <input defaultValue={p.imageUrl} onBlur={e => editPooja(p._id, 'imageUrl', e.target.value)} /></p>
            <button onClick={() => deletePooja(p._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;

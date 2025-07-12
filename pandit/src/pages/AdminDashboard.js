import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [newPooja, setNewPooja] = useState({ name: '', description: '', imageUrl: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPandits();
    fetchPoojas();
  }, []);

  const fetchPandits = async () => {
    const res = await fetch('http://localhost:5000/api/pandits/admin-view');
    const data = await res.json();
    setPandits(data);
  };

  const fetchPoojas = async () => {
    const res = await fetch('http://localhost:5000/api/poojas/view');
    const data = await res.json();
    setPoojas(data);
  };

  const verifyPandit = async id => {
    await fetch(`http://localhost:5000/api/pandits/verify/${id}`, { method: 'PUT' });
    fetchPandits();
  };

  const deletePooja = async id => {
    await fetch(`http://localhost:5000/api/poojas/delete/${id}`, { method: 'DELETE' });
    fetchPoojas();
  };

  const editPooja = async (id, field, value) => {
    const body = { [field]: value };
    await fetch(`http://localhost:5000/api/poojas/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    <div style={{ padding: 40 }}>
      <h1>👨‍💼 Admin Dashboard</h1>

      <section>
        <h2>Pandit Verification</h2>
        {pandits.length ? (
          pandits.map(p => (
            <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <p><strong>{p.name}</strong> {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
              {!p.is_verified && <button onClick={() => verifyPandit(p._id)}>Verify</button>}
            </div>
          ))
        ) : <p>No pandits.</p>}
      </section>

      <hr />

      <section>
        <h2>Pooja Management</h2>
        <div style={{ marginBottom: 20 }}>
          <input
            type="text" placeholder="Name"
            value={newPooja.name}
            onChange={e => setNewPooja(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text" placeholder="Description"
            value={newPooja.description}
            onChange={e => setNewPooja(prev => ({ ...prev, description: e.target.value }))}
          />
          <input
            type="text" placeholder="Image URL"
            value={newPooja.imageUrl}
            onChange={e => setNewPooja(prev => ({ ...prev, imageUrl: e.target.value }))}
          />
          <button onClick={createPooja}>Add Pooja</button>
        </div>

        {poojas.length ? (
          poojas.map(p => (
            <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <p><strong>Name:</strong> 
                <input
                  type="text"
                  defaultValue={p.name}
                  onBlur={e => editPooja(p._id, 'name', e.target.value)}
                />
              </p>
              <p><strong>Description:</strong>
                <input
                  type="text"
                  defaultValue={p.description}
                  onBlur={e => editPooja(p._id, 'description', e.target.value)}
                />
              </p>
              <p><strong>Image URL:</strong>
                <input
                  type="text"
                  defaultValue={p.imageUrl || ''}
                  onBlur={e => editPooja(p._id, 'imageUrl', e.target.value)}
                />
              </p>
              <button onClick={() => deletePooja(p._id)}>Delete</button>
            </div>
          ))
        ) : <p>No poojas.</p>}
      </section>
    </div>
  );
};

export default AdminDashboard;

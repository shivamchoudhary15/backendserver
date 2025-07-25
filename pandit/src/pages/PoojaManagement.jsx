// src/pages/PoojaManagement.jsx
import React, { useEffect, useState } from 'react';
import { getPoojas, addPooja, updatePooja, deletePooja } from '../api/api';
import './PoojaManagement.css';

function PoojaManagement() {
  const [poojas, setPoojas] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchPoojas(); }, []);
  async function fetchPoojas() {
    try {
      const res = await getPoojas();
      setPoojas(res.data);
    } catch (_) {}
  }
  async function handleAdd() {
    await addPooja(form);
    setForm({ name: '', description: '' });
    fetchPoojas();
  }
  async function handleUpdate() {
    await updatePooja(editId, form);
    setEditId(null);
    setForm({ name: '', description: '' });
    fetchPoojas();
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete pooja?')) return;
    await deletePooja(id);
    fetchPoojas();
  }
  function startEdit(p) {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description });
  }

  return (
    <div className="pooja-mgmt-page">
      <h2>Pooja Management</h2>
      <div className="add-pooja-form">
        <input placeholder="Pooja Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        {editId ?
          <>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={()=>{setEditId(null);setForm({name:'',description:''});}}>Cancel</button>
          </>
          :
          <button onClick={handleAdd}>Add Pooja</button>
        }
      </div>
      <div className="pooja-list">
        {poojas.map(p => (
          <div className="pooja-card" key={p._id}>
            <b>{p.name}</b>
            <div>{p.description}</div>
            <button onClick={()=>startEdit(p)}>Edit</button>
            <button onClick={()=>handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PoojaManagement;

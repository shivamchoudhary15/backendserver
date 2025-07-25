// src/pages/PanditsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  getAllPandits, verifyPandit, uploadPanditPhoto, deletePandit
} from '../api/api';
import './PanditsPage.css';

function PanditsPage() {
  const [pandits, setPandits] = useState([]);
  const [panditImg, setPanditImg] = useState({});
  const [imgPreview, setImgPreview] = useState({});
  const [page, setPage] = useState(0);
  const perPage = 4;
  const [filters, setFilters] = useState({ name: '', city: '', experience: '' });

  useEffect(() => {
    fetchPandits();
  }, []);

  async function fetchPandits() {
    try {
      const res = await getAllPandits();
      setPandits(res.data);
    } catch (err) { }
  }

  // Filtering logic: Case-insensitive match
  const filtered = pandits.filter(p => {
    if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.city && !(p.city && p.city.toLowerCase().includes(filters.city.toLowerCase()))) return false;
    if (filters.experience && String(p.experienceYears) !== filters.experience) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const display = filtered.slice(page * perPage, (page+1)*perPage);

  function getPanditImage(pandit) {
    if (imgPreview[pandit._id]) return imgPreview[pandit._id];
    if (pandit.profile_photo_url)
      return pandit.profile_photo_url.startsWith('/uploads')
        ? `https://backendserver-lnxc.onrender.com${pandit.profile_photo_url}`
        : pandit.profile_photo_url;
    return '/images/default-pandit.png';
  }

  return (
    <div className="pandits-page">
      <h2>Pandits Management</h2>
      <div className="pandit-filters">
        <input placeholder="Search Name..." value={filters.name} onChange={e=>setFilters(f=>({...f, name: e.target.value}))} />
        <input placeholder="City..." value={filters.city} onChange={e=>setFilters(f=>({...f, city: e.target.value}))} />
        <input placeholder="Exp. Years" type="number" min="0" value={filters.experience} onChange={e=>setFilters(f=>({...f, experience: e.target.value}))} />
        <button onClick={()=>setFilters({name:'', city:'', experience:''})}>Clear</button>
      </div>
      <div className="pandit-carousel">
        {display.length === 0 ? (
          <p>No pandits found.</p>
        ) : (
          display.map((p, i) => (
            <div key={p._id} className="pandit-card fade-in">
              <img src={getPanditImage(p)} alt={p.name} className="pandit-photo" />
              <div className="pandit-info">
                <p><strong>{p.name}</strong> – {p.email}</p>
                <p>{p.city} | {p.experienceYears} yrs experience</p>
                <p>Languages: {Array.isArray(p.languages) ? p.languages.join(', ') : p.languages}</p>
                <p>Specialties: {Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties}</p>
                <p>Bio: {p.bio}</p>
                <p>Status: {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>
              </div>
              <div className="pandit-actions">
                {!p.is_verified && (
                  <button className="btn-verify" onClick={() => verifyPandit(p._id).then(fetchPandits)}>Verify</button>
                )}
                <button className="btn-delete" onClick={() => window.confirm('Are you sure?') && deletePandit(p._id).then(fetchPandits)}>Delete</button>
              </div>

              <div className="upload-photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setPanditImg(prev => ({ ...prev, [p._id]: file }));
                      const reader = new FileReader();
                      reader.onloadend = () => setImgPreview(prev => ({ ...prev, [p._id]: reader.result }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  disabled={!panditImg[p._id]}
                  onClick={() => uploadPanditPhoto(p._id, new FormData().append('photo', panditImg[p._id])).then(fetchPandits)}
                >Upload Photo</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="carousel-controls">
        <button disabled={page <= 0} onClick={()=>setPage(p=>p-1)}>&lt; Prev</button>
        <span>{page+1}/{Math.max(totalPages, 1)}</span>
        <button disabled={page >= totalPages-1} onClick={()=>setPage(p=>p+1)}>Next &gt;</button>
      </div>
    </div>
  );
}

export default PanditsPage;

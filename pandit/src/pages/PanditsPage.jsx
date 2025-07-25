// src/pages/PanditsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  getAllPandits, verifyPandit, uploadPanditPhoto, deletePandit
} from '../api/api';
import './PanditsPage.css';

function PanditsPage() {
  const [pandits, setPandits] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [panditImg, setPanditImg] = useState({});
  const [imgPreview, setImgPreview] = useState({});
  const [filters, setFilters] = useState({ name: '', city: '', experience: '' });

  useEffect(() => {
    fetchPandits();
  }, []);

  async function fetchPandits() {
    try {
      const res = await getAllPandits();
      setPandits(res.data);
    } catch (err) { console.error(err); }
  }

  const filtered = pandits.filter(p => {
    if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.city && !(p.city && p.city.toLowerCase().includes(filters.city.toLowerCase()))) return false;
    if (filters.experience && String(p.experienceYears) !== filters.experience) return false;
    return true;
  });

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
        <input placeholder="Search Name..." value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
        <input placeholder="City..." value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
        <input
          placeholder="Exp. Years"
          type="number"
          min="0"
          value={filters.experience}
          onChange={e => setFilters(f => ({ ...f, experience: e.target.value }))}
        />
        <button onClick={() => setFilters({ name: '', city: '', experience: '' })}>Clear</button>
      </div>

      <div className="pandit-cards-grid">
        {filtered.length === 0 ? (
          <p>No pandits found.</p>
        ) : (
          filtered.map(p => (
            <div
              key={p._id}
              className={`pandit-card ${expandedId === p._id ? 'expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setExpandedId(expandedId === p._id ? null : p._id);
                }
              }}
              role="button"
              aria-expanded={expandedId === p._id}
            >
              <div className="pandit-header">
                <strong>{p.name}</strong>
                <span className="pandit-city">{p.city || 'Unknown City'}</span>
              </div>

              {expandedId === p._id && (
                <div className="pandit-details">
                  <img src={getPanditImage(p)} alt={p.name} className="pandit-photo" />
                  <p><strong>Email:</strong> {p.email}</p>
                  <p><strong>Experience:</strong> {p.experienceYears} years</p>
                  <p><strong>Languages:</strong> {Array.isArray(p.languages) ? p.languages.join(', ') : p.languages}</p>
                  <p><strong>Specialties:</strong> {Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties}</p>
                  <p><strong>Bio:</strong> {p.bio}</p>
                  <p><strong>Status:</strong> {p.is_verified ? '✅ Verified' : '❌ Not Verified'}</p>

                  <div className="pandit-actions">
                    {!p.is_verified && (
                      <button
                        className="btn-verify"
                        onClick={e => {
                          e.stopPropagation();
                          verifyPandit(p._id).then(fetchPandits);
                        }}
                      >
                        Verify
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure?')) deletePandit(p._id).then(fetchPandits);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="upload-photo">
                    <input
                      type="file"
                      accept="image/*"
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        e.stopPropagation();
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
                      onClick={e => {
                        e.stopPropagation();
                        const formData = new FormData();
                        formData.append('photo', panditImg[p._id]);
                        uploadPanditPhoto(p._id, formData).then(fetchPandits);
                      }}
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PanditsPage;

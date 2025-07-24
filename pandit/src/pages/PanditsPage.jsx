import React, { useEffect, useState } from 'react';
import {
  getAllPandits,
  verifyPandit,
  uploadPanditPhoto,
  deletePandit
} from '../api/api';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './PanditsPage.css';

function PanditsPage() {
  const [pandits, setPandits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [panditImg, setPanditImg] = useState({});
  const [imgPreview, setImgPreview] = useState({});
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchPandits();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [pandits, search, city]);

  async function fetchPandits() {
    try {
      const res = await getAllPandits();
      setPandits(res.data);
    } catch (err) {
      console.error('Error fetching pandits:', err);
    }
  }

  function handleFilter() {
    let res = [...pandits];
    if (search.trim())
      res = res.filter(p =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    if (city)
      res = res.filter(p =>
        p.city && p.city.toLowerCase().includes(city.toLowerCase())
      );
    setFiltered(res);
  }

  const uniqueCities = Array.from(new Set(pandits.map(p => p.city).filter(c => c)));

  async function handleVerify(id) {
    try {
      await verifyPandit(id);
      fetchPandits();
    } catch (err) {
      console.error('Verify error:', err);
    }
  }

  async function handlePhotoUpload(id) {
    if (!panditImg[id]) return;
    try {
      const form = new FormData();
      form.append('photo', panditImg[id]);
      await uploadPanditPhoto(id, form);
      setPanditImg(prev => ({ ...prev, [id]: null }));
      setImgPreview(prev => ({ ...prev, [id]: null }));
      fetchPandits();
    } catch (err) {
      console.error('Upload photo error:', err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this pandit?')) {
      try {
        await deletePandit(id);
        fetchPandits();
      } catch (err) {
        console.error('Delete pandit error:', err);
      }
    }
  }

  function getPanditImage(pandit) {
    if (imgPreview[pandit._id]) return imgPreview[pandit._id];
    if (pandit.profile_photo_url)
      return pandit.profile_photo_url.startsWith('/uploads')
        ? `https://backendserver-6-yebf.onrender.com${pandit.profile_photo_url}`
        : pandit.profile_photo_url;
    return '/images/default-pandit.png';
  }

  const topPandits = pandits.filter(p => p.is_verified).slice(0, 6);

  return (
    <div className="pandits-page">
      <h2>Pandits Management</h2>
      <div className="filters-row">
        <input
          type="text"
          value={search}
          placeholder="Search by name"
          onChange={e => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="filter-input"
        >
          <option value="">All Cities</option>
          {uniqueCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="highlighted-slideshow">
        <Slide autoplay={true} interval={3000} arrows={false} indicators={true}>
          {topPandits.map(p => (
            <div className="pandit-slide" key={p._id}>
              <img src={getPanditImage(p)} alt={p.name} className="pandit-slide-photo"/>
              <div className="pandit-slide-info">
                <p><strong>{p.name}</strong> – {p.city}</p>
                <p>{p.experienceYears} yrs experience</p>
              </div>
            </div>
          ))}
        </Slide>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-msg">No pandits found.</p>
      ) : (
        <div className="pandit-grid">
          {filtered.map(p => (
            <div key={p._id} className="pandit-card">
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
                  <button className="btn-verify" onClick={() => handleVerify(p._id)}>
                    Verify
                  </button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
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
                      reader.onloadend = () => {
                        setImgPreview(prev => ({ ...prev, [p._id]: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  disabled={!panditImg[p._id]}
                  onClick={() => handlePhotoUpload(p._id)}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PanditsPage;

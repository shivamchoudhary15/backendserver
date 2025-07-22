import React, { useEffect, useState } from 'react';
import {
  getAllPandits,
  verifyPandit,
  uploadPanditPhoto,
  deletePandit
} from '../api/api';
import './PanditsPage.css';

function PanditsPage() {
  const [pandits, setPandits] = useState([]);
  const [panditImg, setPanditImg] = useState({});
  const [imgPreview, setImgPreview] = useState({});

  useEffect(() => {
    fetchPandits();
  }, []);

  async function fetchPandits() {
    try {
      const res = await getAllPandits();
      setPandits(res.data);
    } catch (err) {
      console.error('Error fetching pandits:', err);
    }
  }

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

  return (
    <div className="pandits-page">
      <h2>Pandits Management</h2>
      {pandits.length === 0 ? (
        <p>No pandits found.</p>
      ) : (
        pandits.map(p => (
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
        ))
      )}
    </div>
  );
}

export default PanditsPage;

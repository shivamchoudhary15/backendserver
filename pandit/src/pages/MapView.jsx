// src/pages/MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapView({ userLocations = [], panditLocations = [] }) {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', height: '80vh', marginTop: '2rem', borderRadius: '14px', position: 'relative', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
      <button
        style={{
          position: 'absolute', right: 16, top: 16, background: 'rgba(255,255,255,0.92)',
          border: 'none', borderRadius: 22, width: 38, height: 38, fontSize: '1.7rem', zIndex: 500, cursor: 'pointer'
        }}
        title="Back"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >&#10006;</button>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '14px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocations.map(({ id, lat, lng, name }) => (
          <Marker key={`user-${id}`} position={[lat, lng]}>
            <Popup>User: {name}</Popup>
          </Marker>
        ))}
        {panditLocations.map(({ id, lat, lng, name }) => (
          <Marker key={`pandit-${id}`} position={[lat, lng]}>
            <Popup>Pandit: {name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default MapView;

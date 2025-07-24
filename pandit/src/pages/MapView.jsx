import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapView({ userLocations = [], panditLocations = [] }) {
  return (
    <div className="dashboard-map-wrap">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="dashboard-map"
      >
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

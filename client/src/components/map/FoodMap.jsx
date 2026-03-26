import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { qualityColor } from '../../utils/helpers';

function FoodMap({ listings = [], center = [22.5726, 88.3639], zoom = 13, radiusKm = 5, userLocation, selectedId, onSelect }) {
  const markerGroups = useMemo(() => {
    const bucket = new Map();

    listings
      .filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)))
      .forEach((item) => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);
        const key = `${lat.toFixed(2)}:${lng.toFixed(2)}`;

        if (!bucket.has(key)) {
          bucket.set(key, {
            id: key,
            lat,
            lng,
            items: []
          });
        }

        bucket.get(key).items.push(item);
      });

    return Array.from(bucket.values());
  }, [listings]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '560px', width: '100%', borderRadius: '16px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <CircleMarker center={[userLocation.lat, userLocation.lng]} radius={10} pathOptions={{ color: '#2563eb', fillOpacity: 0.8 }}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </CircleMarker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radiusKm * 1000}
            pathOptions={{ color: '#2563eb', fillOpacity: 0.08 }}
          />
        </>
      )}

      {markerGroups.map((group) => {
        const primary = group.items[0];
        const isCluster = group.items.length > 1;
        const selected = group.items.some((item) => String(item.id) === String(selectedId));
        const radius = isCluster ? Math.min(18, 8 + group.items.length * 2) : 9;

        return (
          <CircleMarker
            key={group.id}
            center={[group.lat, group.lng]}
            radius={radius}
            eventHandlers={{ click: () => onSelect?.(String(primary.id)) }}
            pathOptions={{
              color: selected ? '#1d4ed8' : qualityColor(primary.quality_status),
              fillOpacity: selected ? 1 : 0.88
            }}
          >
            <Popup>
              {isCluster ? (
                <>
                  <strong>{group.items.length} pickups in this area</strong>
                  <ul>
                    {group.items.slice(0, 4).map((item) => (
                      <li key={item.id}>
                        {item.title} ({item.priority?.label || 'priority'})
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <strong>{primary.title}</strong><br />
                  Qty: {primary.quantity || 'N/A'}<br />
                  Expires: {new Date(primary.expiry_time).toLocaleString()}<br />
                  Status: {primary.quality_status}<br />
                  <Link to={`/foods/${primary.id}`}>View Details</Link>
                </>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default FoodMap;

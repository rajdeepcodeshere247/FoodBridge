import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FoodMap from '../components/map/FoodMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLocationContext } from '../context/LocationContext';
import { motion } from 'framer-motion';
import { getAllFood, getNearbyFood } from '../services/food.service';
import { calculateDistanceKm, getNavigationUrl, getPriorityMeta, normalizeQualityStatus } from '../utils/helpers';

function MapPage() {
  const [searchParams] = useSearchParams();
  const { location, status } = useLocationContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedId, setSelectedId] = useState(() => searchParams.get('focus') || null);

  const [selectedId, setSelectedId] = useState(() => searchParams.get('focus') || null);

  useEffect(() => {
    const focusId = searchParams.get('focus');
    if (focusId) {
      setSelectedId(focusId);
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (location) {
          const res = await getNearbyFood(location.lat, location.lng, radiusKm);
          setItems(Array.isArray(res.data) ? res.data : (res.data?.items || []));
        } else {
          const res = await getAllFood();
          setItems(Array.isArray(res.data) ? res.data : (res.data?.items || []));
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [location, radiusKm]);

  const center = useMemo(() => (location ? [location.lat, location.lng] : [22.5726, 88.3639]), [location]);

  const normalizedListings = useMemo(() => items
    .map((item) => {
      const distanceKm = calculateDistanceKm(location, { lat: item.latitude, lng: item.longitude });
      return {
        ...item,
        priority: getPriorityMeta(item.expiry_time),
        quality_status: normalizeQualityStatus(item.quality_status, item.expiry_time),
        distanceKm
      };
    })
    .filter((item) => !location || (typeof item.distanceKm === 'number' && item.distanceKm <= radiusKm))
    .sort((a, b) => {
      if (a.priority.rank !== b.priority.rank) {
        return a.priority.rank - b.priority.rank;
      }
      return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
    }), [items, location, radiusKm]);

  return (
    <div className="fb-page">
      <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}}>
        <h1>Food Rescue Map</h1>
        <p className="fb-subtitle">
          {status === 'success'
            ? 'Map and list stay in sync. Click either side to focus, navigate, and pick up faster.'
            : 'Enable location to discover nearby urgent pickups in real time.'}
        </p>
      </motion.div>

      <motion.section 
        className="fb-panel"
        initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}
      >
        <div className="fb-toolbar">
          <label htmlFor="radius-select"><strong>Search radius</strong></label>
          <select id="radius-select" className="fb-input fb-input-inline" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}>
            <option value={3}>3 km</option>
            <option value={5}>5 km</option>
            <option value={8}>8 km</option>
          </select>
        </div>
      </motion.section>

      <motion.section 
        className="fb-map-layout"
        initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}
      >
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="fb-map-sidepanel">
              <h3>Nearby Listings ({normalizedListings.length})</h3>
              {normalizedListings.map((item) => (
                <motion.article
                  whileHover={{ x: 4, backgroundColor: "var(--fb-bg-accent)" }}
                  key={item.id}
                  className={`fb-map-item ${selectedId === String(item.id) ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(String(item.id))}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedId(String(item.id))}
                  role="button"
                  tabIndex={0}
                >
                  <div className="fb-map-item-head">
                    <h4>{item.title}</h4>
                    <span className={`fb-priority-chip ${item.priority.level}`}>{item.priority.label}</span>
                  </div>
                  <p>{item.quantity || 'N/A'} • {item.distanceKm ? `${item.distanceKm.toFixed(1)} km` : 'Distance N/A'}</p>
                  <p className="fb-muted">Expires: {new Date(item.expiry_time).toLocaleString()}</p>
                  <div className="fb-map-actions">
                    {getNavigationUrl(item, location) ? (
                      <a className="fb-btn-secondary" href={getNavigationUrl(item, location)} target="_blank" rel="noreferrer">Navigate</a>
                    ) : (
                      <button type="button" className="fb-btn-secondary" disabled>Navigate</button>
                    )}
                  </div>
                </motion.article>
              ))}
              {!normalizedListings.length && <p className="fb-empty">No food markers available for selected radius.</p>}
            </div>
            <FoodMap
              listings={normalizedListings}
              center={center}
              userLocation={location}
              radiusKm={radiusKm}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </>
        )}
      </motion.section>
    </div>
  );
}

export default MapPage;

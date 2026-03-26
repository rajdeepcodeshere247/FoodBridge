import React, { useEffect, useMemo, useState } from 'react';
import FoodMap from '../components/map/FoodMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLocation } from '../hooks/useLocation';
import { getAllFood, getNearbyFood } from '../services/food.service';

function MapPage() {
  const { location } = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (location) {
          const res = await getNearbyFood(location.lat, location.lng, 8);
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
  }, [location]);

  const center = useMemo(() => (location ? [location.lat, location.lng] : [22.5726, 88.3639]), [location]);

  return (
    <div className="fb-page">
      <h1>Food Rescue Map</h1>
      <p className="fb-subtitle">Use location-based discovery to find urgent nearby pickups.</p>
      {loading ? <LoadingSpinner /> : <FoodMap listings={items} center={center} />}
    </div>
  );
}

export default MapPage;

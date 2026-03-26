import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodList from '../components/food/FoodList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLocationContext } from '../context/LocationContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getAllFood } from '../services/food.service';

function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, status } = useLocationContext();

  useScrollReveal();

  useEffect(() => {
    getAllFood()
      .then((res) => setItems(Array.isArray(res.data) ? res.data : (res.data?.items || [])))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fb-page">
      <section className="fb-hero fb-reveal">
        <h1>Connect surplus food to people in need.</h1>
        <p>FoodBridge helps donors, volunteers, and NGOs coordinate food rescue in real time.</p>
        {status === 'success' && location && (
          <p className="fb-subtitle">
            You are near {location.lat.toFixed(4)}, {location.lng.toFixed(4)} (±{Math.round(location.accuracy || 0)}m)
          </p>
        )}
        <div className="fb-actions">
          <Link to="/foods" className="fb-btn">Browse Food</Link>
          <Link to="/add-food" className="fb-btn-secondary">Donate Food</Link>
        </div>
      </section>

      <section className="fb-reveal">
        <h2>Latest Listings</h2>
        {loading ? <LoadingSpinner label="Fetching available food..." /> : <FoodList items={items.slice(0, 6)} />}
      </section>
    </div>
  );
}

export default HomePage;

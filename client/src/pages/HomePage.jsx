import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodList from '../components/food/FoodList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllFood } from '../services/food.service';

function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFood()
      .then((res) => setItems(Array.isArray(res.data) ? res.data : (res.data?.items || [])))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fb-page">
      <section className="fb-hero">
        <h1>Connect surplus food to people in need.</h1>
        <p>FoodBridge helps donors, volunteers, and NGOs coordinate food rescue in real time.</p>
        <div className="fb-actions">
          <Link to="/foods" className="fb-btn">Browse Food</Link>
          <Link to="/add-food" className="fb-btn-secondary">Donate Food</Link>
        </div>
      </section>

      <section>
        <h2>Latest Listings</h2>
        {loading ? <LoadingSpinner label="Fetching available food..." /> : <FoodList items={items.slice(0, 6)} />}
      </section>
    </div>
  );
}

export default HomePage;

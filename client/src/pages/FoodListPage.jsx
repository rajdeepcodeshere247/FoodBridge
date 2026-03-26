import React, { useEffect, useState } from 'react';
import FoodList from '../components/food/FoodList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllFood } from '../services/food.service';

function FoodListPage() {
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
      <h1>Available Food Listings</h1>
      <p className="fb-subtitle">Find nearby meals before they expire.</p>
      {loading ? <LoadingSpinner /> : <FoodList items={items} />}
    </div>
  );
}

export default FoodListPage;

import React from 'react';
import FoodCard from '../common/FoodCard';

function FoodList({ items = [] }) {
  if (!items.length) {
    return <p className="fb-empty">No food listings available right now.</p>;
  }

  return (
    <div className="fb-grid">
      {items.map((item) => (
        <FoodCard key={item.id} food={item} />
      ))}
    </div>
  );
}

export default FoodList;

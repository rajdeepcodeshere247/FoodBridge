import React from 'react';
import FoodCard from '../common/FoodCard';

function FoodList({ items = [], onAcceptPickup, onViewMap, userLocation }) {
  if (!items.length) {
    return <p className="fb-empty">No food listings match your filters right now.</p>;
  }

  return (
    <div className="fb-grid">
      {items.map((item) => (
        <FoodCard
          key={item.id}
          food={item}
          onAcceptPickup={onAcceptPickup}
          onViewMap={onViewMap}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
}

export default FoodList;

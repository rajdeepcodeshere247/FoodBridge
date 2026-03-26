import React from 'react';
import { Link } from 'react-router-dom';
import { truncate } from '../../utils/helpers';
import ExpiryTimer from './ExpiryTimer';
import FoodQualityBadge from '../food/FoodQualityBadge';

export default function FoodCard({ food }) {
  return (
    <article className="fb-card">
      <img
        src={food.image_url || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80'}
        alt={food.title}
        className="fb-card-img"
      />
      <div className="fb-card-body">
        <h3>{food.title}</h3>
        <p>{truncate(food.description || 'No description available.', 110)}</p>
        <div className="fb-row">
          <strong>Qty:</strong> <span>{food.quantity || 'N/A'}</span>
        </div>
        <div className="fb-row">
          <strong>Location:</strong> <span>{food.location_text || 'Not specified'}</span>
        </div>
        <div className="fb-row">
          <ExpiryTimer expiryTime={food.expiry_time} />
        </div>
        <FoodQualityBadge status={food.quality_status} confidenceScore={food.confidence_score} />
        <Link className="fb-btn" to={`/foods/${food.id}`}>View Details</Link>
      </div>
    </article>
  );
}

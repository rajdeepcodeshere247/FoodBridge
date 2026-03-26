import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { truncate, getNavigationUrl } from '../../utils/helpers';
import ExpiryTimer from './ExpiryTimer';
import FoodQualityBadge from '../food/FoodQualityBadge';

export default function FoodCard({ food, onAcceptPickup, onViewMap, userLocation }) {
  const navigationUrl = getNavigationUrl(food, userLocation);

  return (
    <article className={`fb-card fb-reveal priority-${food.priority?.level || 'safe'}`}>
      <img
        src={food.image_url || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80'}
        alt={food.title}
        className="fb-card-img"
      />
      <div className="fb-card-body">
        <div className="fb-card-topline">
          <h3>{food.title}</h3>
          {food.priority && <span className={`fb-priority-chip ${food.priority.level}`}>{food.priority.label}</span>}
        </div>
        <p>{truncate(food.description || 'No description available.', 110)}</p>
        <div className="fb-row">
          <strong>Qty:</strong> <span>{food.quantity || 'N/A'}</span>
        </div>
        <div className="fb-row">
          <strong>Distance:</strong> <span>{food.distanceLabel || 'Distance unavailable'}</span>
        </div>
        <div className="fb-row">
          <strong>Location:</strong> <span>{food.location_text || 'Not specified'}</span>
        </div>
        <div className="fb-row">
          <ExpiryTimer expiryTime={food.expiry_time} />
        </div>
        <FoodQualityBadge status={food.quality_status} confidenceScore={food.confidence_score} />
        <div className="fb-card-actions">
          <button type="button" className="fb-btn" onClick={() => onAcceptPickup?.(food)}>
            Accept Pickup
          </button>
          <button type="button" className="fb-btn-secondary" onClick={() => onViewMap?.(food)}>
            <FiMapPin /> View on map
          </button>
          {navigationUrl ? (
            <a className="fb-btn-secondary" href={navigationUrl} target="_blank" rel="noreferrer">
              <FiNavigation /> Navigate
            </a>
          ) : (
            <button type="button" className="fb-btn-secondary" disabled title="Coordinates unavailable">
              <FiNavigation /> Navigate
            </button>
          )}
          <Link className="fb-btn-secondary" to={`/foods/${food.id}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}

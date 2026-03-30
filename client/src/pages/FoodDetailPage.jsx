import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ExpiryTimer from '../components/common/ExpiryTimer';
import FoodQualityBadge from '../components/food/FoodQualityBadge';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getFoodById } from '../services/food.service';
import { resolveImageUrl } from '../utils/helpers';

function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useScrollReveal();

  useEffect(() => {
    getFoodById(id)
      .then((res) => setFood(res.data?.item || res.data || null))
      .catch(() => setFood(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading food details..." />;
  if (!food) return <p className="fb-empty">Food listing not found.</p>;

  const imageUrl = resolveImageUrl(food.image_url);

  return (
    <div className="fb-page fb-detail">
      <img
        src={imageUrl || 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80'}
        alt={food.title}
        className="fb-detail-img fb-reveal"
      />
      <div className="fb-reveal">
        <h1>{food.title}</h1>
        <p>{food.description}</p>
        <p><strong>Quantity:</strong> {food.quantity || 'N/A'}</p>
        <p><strong>Location:</strong> {food.location_text || 'Not specified'}</p>
        <p><strong>Expires:</strong> <ExpiryTimer expiryTime={food.expiry_time} /></p>
        <FoodQualityBadge status={food.quality_status} confidenceScore={food.confidence_score} />
      </div>
    </div>
  );
}

export default FoodDetailPage;

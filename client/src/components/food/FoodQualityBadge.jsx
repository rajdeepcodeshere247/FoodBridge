import React from 'react';
import { qualityColor } from '../../utils/helpers';

function FoodQualityBadge({ status = 'unknown', confidenceScore }) {
  const color = qualityColor((status || '').toLowerCase());

  return (
    <span className="fb-badge" style={{ backgroundColor: color }}>
      {(status || 'Unknown').toUpperCase()}
      {typeof confidenceScore === 'number' ? ` • ${(confidenceScore * 100).toFixed(0)}%` : ''}
    </span>
  );
}

export default FoodQualityBadge;

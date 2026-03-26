// ImpactStats — shows meals saved, volunteers active, etc.
import React from 'react';

function ImpactStats({ stats = {} }) {
  // TODO: Fetch real stats from backend /api/stats
  return (
    <div className="impact-stats">
      <div>Meals Saved: {stats.mealsSaved ?? 0}</div>
      <div>Active Volunteers: {stats.volunteers ?? 0}</div>
      <div>Food Listings Today: {stats.listingsToday ?? 0}</div>
    </div>
  );
}

export default ImpactStats;

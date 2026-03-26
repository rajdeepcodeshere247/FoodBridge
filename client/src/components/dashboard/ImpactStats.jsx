import React from 'react';

function ImpactStats({ stats = {} }) {
  const cards = [
    { label: 'Meals Saved', value: stats.mealsSaved ?? 0 },
    { label: 'Active Volunteers', value: stats.volunteers ?? 0 },
    { label: 'Listings Today', value: stats.listingsToday ?? 0 },
    { label: 'Successful Deliveries', value: stats.deliveries ?? 0 }
  ];

  return (
    <div className="fb-stats-grid">
      {cards.map((item) => (
        <div key={item.label} className="fb-stat-card">
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </div>
      ))}
    </div>
  );
}

export default ImpactStats;

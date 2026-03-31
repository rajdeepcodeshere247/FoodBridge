import React from 'react';

const CARD_META = [
  { key: 'mealsSaved',    label: 'Meals Saved',           icon: '🍽️', color: 'green'  },
  { key: 'volunteers',    label: 'Active Volunteers',      icon: '🤝', color: 'blue'   },
  { key: 'listingsToday', label: 'Listings Today',         icon: '📋', color: 'amber'  },
  { key: 'deliveries',    label: 'Successful Deliveries',  icon: '✅', color: 'teal'   },
];

function AnimatedNumber({ value, loading }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (loading || value === 0) { setDisplay(0); return; }
    let start = 0;
    const end = value;
    const duration = 900;
    const step = Math.ceil(duration / end) || 10;
    const timer = setInterval(() => {
      start += Math.max(1, Math.floor(end / 40));
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, step);
    return () => clearInterval(timer);
  }, [value, loading]);

  return <span>{loading ? '—' : display.toLocaleString()}</span>;
}

function ImpactStats({ stats = {}, loading = false }) {
  return (
    <div className="is-grid">
      {CARD_META.map(({ key, label, icon, color }, i) => (
        <div
          key={key}
          className={`is-card is-card--${color}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="is-card-top">
            <span className="is-icon">{icon}</span>
            <span className="is-label">{label}</span>
          </div>
          <div className={`is-value ${loading ? 'is-value--loading' : ''}`}>
            <AnimatedNumber value={stats[key] ?? 0} loading={loading} />
          </div>
          <div className="is-bar">
            <div
              className="is-bar-fill"
              style={{ width: loading ? '0%' : `${Math.min(100, ((stats[key] ?? 0) / 100) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImpactStats;
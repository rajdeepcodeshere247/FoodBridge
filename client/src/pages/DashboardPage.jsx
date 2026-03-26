import React, { useEffect, useState } from 'react';
import ImpactStats from '../components/dashboard/ImpactStats';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getAllFood } from '../services/food.service';

function DashboardPage() {
  const [stats, setStats] = useState({});

  useScrollReveal();

  useEffect(() => {
    getAllFood()
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        const now = Date.now();
        const listingsToday = items.filter((i) => new Date(i.created_at || i.expiry_time).toDateString() === new Date().toDateString()).length;
        const mealsSaved = items.reduce((acc, item) => acc + (parseInt(item.quantity, 10) || 0), 0);
        const urgent = items.filter((i) => new Date(i.expiry_time).getTime() - now < 2 * 60 * 60 * 1000).length;
        setStats({
          mealsSaved,
          volunteers: Math.max(3, Math.ceil(items.length / 5)),
          listingsToday,
          deliveries: Math.max(0, items.length - urgent)
        });
      })
      .catch(() => setStats({ mealsSaved: 0, volunteers: 0, listingsToday: 0, deliveries: 0 }));
  }, []);

  return (
    <div className="fb-page">
      <div className="fb-reveal">
        <h1>Impact Dashboard</h1>
        <p className="fb-subtitle">Track rescue progress and community contribution.</p>
      </div>
      <section className="fb-reveal">
        <ImpactStats stats={stats} />
      </section>
    </div>
  );
}

export default DashboardPage;

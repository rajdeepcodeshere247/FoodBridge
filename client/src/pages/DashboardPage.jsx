import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImpactStats from '../components/dashboard/ImpactStats';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getAllFood } from '../services/food.service';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
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
        <h1>Welcome, {user?.name?.split(' ')[0] || 'FoodBridge Hero'} 👋</h1>
        <p className="fb-subtitle">Track rescue progress and jump into donor or volunteer actions.</p>
      </div>

      <section className="fb-reveal">
        <ImpactStats stats={stats} />
      </section>

      <section className="fb-grid fb-reveal">
        <article className="fb-panel">
          <h3>Donor Dashboard</h3>
          <p>Post new donations and manage listing status (available/picked).</p>
          <div className="fb-actions">
            <Link to="/add-food" className="fb-btn">Donate Food</Link>
            <Link to="/foods" className="fb-btn-secondary">My Listings</Link>
          </div>
        </article>

        <article className="fb-panel">
          <h3>Volunteer / User Dashboard</h3>
          <p>Check requested pickups, browse nearby food, and use map navigation.</p>
          <div className="fb-actions">
            <Link to="/foods" className="fb-btn">Request Food</Link>
            <Link to="/map" className="fb-btn-secondary">Open Map</Link>
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;

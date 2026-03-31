import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImpactStats from '../components/dashboard/ImpactStats';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getAllFood } from '../services/food.service';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useScrollReveal();

  useEffect(() => {
    getAllFood()
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        const now = Date.now();
        const listingsToday = items.filter(
          (i) => new Date(i.created_at || i.expiry_time).toDateString() === new Date().toDateString()
        ).length;
        const mealsSaved = items.reduce((acc, item) => acc + (parseInt(item.quantity, 10) || 0), 0);
        const urgent = items.filter(
          (i) => new Date(i.expiry_time).getTime() - now < 2 * 60 * 60 * 1000
        ).length;
        setStats({
          mealsSaved,
          volunteers: Math.max(3, Math.ceil(items.length / 5)),
          listingsToday,
          deliveries: Math.max(0, items.length - urgent),
        });
      })
      .catch(() =>
        setStats({ mealsSaved: 0, volunteers: 0, listingsToday: 0, deliveries: 0 })
      )
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Hero';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dp-page">
      {/* background layers */}
      <div className="dp-bg-blob dp-bg-blob--a" />
      <div className="dp-bg-blob dp-bg-blob--b" />
      <div className="dp-bg-grid" />

      <div className="dp-inner">

        {/* ── Hero greeting ── */}
        <header className="dp-hero fb-reveal">
          <div className="dp-greeting-badge">
            <span className="dp-status-dot" />
            FoodBridge Dashboard
          </div>
          <h1 className="dp-hero-title">
            {greeting},<br />
            <span className="dp-name-highlight">{firstName}</span> 👋
          </h1>
          <p className="dp-hero-sub">
            Track rescue progress and jump into donor or volunteer actions.
          </p>
        </header>

        {/* ── Stats ── */}
        <section className="fb-reveal">
          <ImpactStats stats={stats} loading={loading} />
        </section>

        {/* ── Action panels ── */}
        <section className="dp-panels fb-reveal">
          {/* Donor card */}
          <article className="dp-panel dp-panel--donor">
            <div className="dp-panel-icon">🍱</div>
            <div className="dp-panel-body">
              <h3 className="dp-panel-title">Donor</h3>
              <p className="dp-panel-desc">
                Post new donations and manage listing status.
              </p>
              <div className="dp-panel-actions">
                <Link to="/add-food" className="dp-btn dp-btn--primary">
                  <span>＋</span> Donate Food
                </Link>
                <Link to="/foods?mine=1" className="dp-btn dp-btn--ghost">
                  My Listings
                </Link>
              </div>
            </div>
          </article>

          {/* Volunteer card */}
          <article className="dp-panel dp-panel--volunteer">
            <div className="dp-panel-icon">🤝</div>
            <div className="dp-panel-body">
              <h3 className="dp-panel-title">Volunteer</h3>
              <p className="dp-panel-desc">
                Browse nearby food and navigate pickups on the map.
              </p>
              <div className="dp-panel-actions">
                <Link to="/foods" className="dp-btn dp-btn--primary">
                  Request Food
                </Link>
                <Link to="/map" className="dp-btn dp-btn--ghost">
                  🗺️ Open Map
                </Link>
              </div>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}

export default DashboardPage;
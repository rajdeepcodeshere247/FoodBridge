import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import LoginButton from '../auth/LoginButton';
import './Navbar.css';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80C10 80 30 30 50 30C70 30 90 80 90 80" stroke="#0f766e" strokeWidth="12" strokeLinecap="round"/>
    <path d="M50 30V15" stroke="#10b981" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="50" cy="12" r="6" fill="#10b981" />
    <path d="M30 80H70" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

export default function Navbar() {
  const { user } = useAuth();
  const { location, status, requestLocation } = useLocationContext();
  const route = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('fb-theme');
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('fb-dark', theme === 'dark');
    localStorage.setItem('fb-theme', theme);
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [route.pathname]);

  const locationLabel =
    status === 'loading'
      ? 'Locating…'
      : status === 'success' && location
        ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}`
        : 'Location off';

  return (
    <header className="fb-navbar-wrap">
      <nav className="fb-navbar">
        <Link to="/" className="fb-brand" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span className="brand-text">FoodBridge</span>
        </Link>

        <button type="button" className="nav-mobile-toggle" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`fb-nav-links ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/foods" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Listings
          </NavLink>
          <NavLink to="/map" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Map
          </NavLink>

          {user && (
            <>
              <NavLink to="/add-food" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Donate Food
              </NavLink>
              <NavLink to="/foods" onClick={() => setMenuOpen(false)} className="nav-link">
                My Listings
              </NavLink>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Deliveries
              </NavLink>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Profile
              </NavLink>
            </>
          )}

          <button type="button" className="nav-location-pill" onClick={requestLocation} title="Refresh precise location">
            📍 {locationLabel}
          </button>

          <button
            type="button"
            className="nav-theme-pill"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            title="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {user && (
            <div className="fb-user-chip" title={user.email}>
              {user.avatar_url ? <img src={user.avatar_url} alt={user.name} className="fb-user-avatar" /> : <span className="fb-user-avatar-fallback">👤</span>}
              <span>{user.name?.split(' ')[0]}</span>
            </div>
          )}

          <div className="nav-auth-section">
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

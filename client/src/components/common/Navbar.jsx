import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import LoginButton from '../auth/LoginButton';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();
  const { location, status, requestLocation } = useLocationContext();
  const route = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Theme State Logic
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('fb-theme');
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.body.classList.toggle('fb-dark', theme === 'dark');
    localStorage.setItem('fb-theme', theme);
  }, [theme]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [route.pathname]);

  const locationLabel = status === 'success' && location 
    ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` 
    : 'Locating...';

  return (
    <header className="fb-navbar-wrap">
      <nav className="fb-navbar">
        {/* Left: Brand Section */}
        <div className="fb-brand-section">
          <Link to="/" className="fb-brand">
            <img src="/logo.webp" alt="FoodBridge" className="fb-logo-img" />
            <span className="brand-text">FoodBridge</span>
          </Link>
        </div>

        {/* Center/Right: Navigation and Actions Container */}
        <div className={`fb-nav-container ${menuOpen ? 'is-open' : ''}`}>
          <div className="fb-nav-primary-links">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/foods" className="nav-link">Listings</NavLink>
            <NavLink to="/map" className="nav-link">Map</NavLink>
            {user && <NavLink to="/add-food" className="nav-link">Donate</NavLink>}
          </div>

          <div className="fb-nav-actions-group">
            <button className="nav-location-pill" onClick={requestLocation} title="Refresh Location">
              <span className="pill-dot"></span>
              {locationLabel}
            </button>

            {/* High-End Theme Toggle Switch */}
            <div className="theme-switch-container">
              <input 
                type="checkbox" 
                id="theme-toggle" 
                checked={theme === 'dark'}
                onChange={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
              />
              <label htmlFor="theme-toggle" className="theme-switch-label">
                <FiSun className="sun-icon" />
                <FiMoon className="moon-icon" />
                <div className="toggle-ball"></div>
              </label>
            </div>

            <div className="nav-auth-section">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="nav-mobile-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>
    </header>
  );
}
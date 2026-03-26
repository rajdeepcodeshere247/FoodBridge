import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginButton from '../auth/LoginButton';
import './Navbar.css';

// Custom SVG Logo Component for FoodBridge
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

  return (
    <header className="fb-navbar-wrap">
      <nav className="fb-navbar">
        <Link to="/" className="fb-brand">
          <Logo />
          <span className="brand-text">FoodBridge</span>
        </Link>

        <div className="fb-nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/foods" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Listings
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Map
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Profile
              </NavLink>
            </>
          )}

          <div className="nav-auth-section">
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
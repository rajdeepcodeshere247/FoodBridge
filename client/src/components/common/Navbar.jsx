import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItemStyle = ({ isActive }) => ({
  color: isActive ? '#0f766e' : '#111827',
  fontWeight: isActive ? 700 : 500,
  padding: '0.4rem 0.6rem',
  borderRadius: '0.5rem'
});

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fb-navbar-wrap">
      <nav className="fb-navbar">
        <Link to="/" className="fb-brand">🌉 FoodBridge</Link>
        <div className="fb-nav-links">
          <NavLink to="/" style={navItemStyle}>Home</NavLink>
          <NavLink to="/foods" style={navItemStyle}>Food Listings</NavLink>
          <NavLink to="/map" style={navItemStyle}>Map</NavLink>
          <NavLink to="/dashboard" style={navItemStyle}>Dashboard</NavLink>
          {user ? (
            <NavLink to="/profile" style={navItemStyle}>Profile</NavLink>
          ) : (
            <NavLink to="/login" style={navItemStyle}>Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

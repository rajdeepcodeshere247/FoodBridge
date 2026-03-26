import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, logout } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function LoginButton() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  if (user) {
    return (
      <button className="fb-btn-secondary" onClick={handleLogout}>
        Logout {user.name ? `(${user.name})` : ''}
      </button>
    );
  }

  return (
    <button className="fb-btn" onClick={loginWithGoogle}>
      Continue with Google
    </button>
  );
}

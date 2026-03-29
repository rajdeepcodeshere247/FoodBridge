import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineLogout } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { loginWithGoogle } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import './LoginButton.css';

export default function LoginButton() {
  const { user, logoutUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);
    loginWithGoogle('/dashboard');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      navigate('/');
      toast.info('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <button
        className={`fb-auth-btn logout-variant ${isLoading ? 'loading' : ''}`}
        onClick={handleLogout}
        disabled={isLoading}
      >
        <span className="icon-wrapper">
          <HiOutlineLogout />
        </span>
        <span className="btn-text">
          {isLoading ? 'Exiting...' : 'Logout'}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`fb-auth-btn login-variant ${isLoading ? 'loading' : ''}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <span className="icon-wrapper">
        <FcGoogle />
      </span>
      <span className="btn-text">
        {isLoading ? 'Redirecting...' : 'Continue with Google'}
      </span>
      <div className="shimmer-effect"></div>
    </button>
  );
}

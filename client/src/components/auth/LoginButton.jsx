import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineLogout } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { loginWithGoogle, logout } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import './LoginButton.css';

export default function LoginButton() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userData = await loginWithGoogle();
      setUser(userData);
      toast.success(`Welcome back, ${userData?.name?.split(' ')[0] || 'User'}!`);
    } catch (err) {
      toast.error("Google sign-in failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      navigate('/');
      toast.info("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
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
          {isLoading ? 'Exiting...' : `Logout (${user.name?.split(' ')[0]})`}
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
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
      <div className="shimmer-effect"></div>
    </button>
  );
}
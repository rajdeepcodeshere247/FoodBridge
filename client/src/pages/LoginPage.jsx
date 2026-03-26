import React from 'react';
import LoginButton from '../components/auth/LoginButton';
import { useScrollReveal } from '../hooks/useScrollReveal';

function LoginPage() {
  useScrollReveal();

  return (
    <div className="fb-page fb-login">
      <h1 className="fb-reveal">Login to FoodBridge</h1>
      <p className="fb-reveal">Sign in with Google to donate food, claim deliveries, and track your impact.</p>
      <div className="fb-reveal">
        <LoginButton />
      </div>
    </div>
  );
}

export default LoginPage;

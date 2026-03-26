import React from 'react';
import LoginButton from '../components/auth/LoginButton';

function LoginPage() {
  return (
    <div className="fb-page fb-login">
      <h1>Login to FoodBridge</h1>
      <p>Sign in with Google to donate food, claim deliveries, and track your impact.</p>
      <LoginButton />
    </div>
  );
}

export default LoginPage;

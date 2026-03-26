import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

function ProfilePage() {
  const { user } = useAuth();
  useScrollReveal();

  return (
    <div className="fb-page">
      <h1 className="fb-reveal">Profile</h1>
      {user ? (
        <div className="fb-profile fb-reveal">
          <img src={user.profileImage || user.picture || 'https://via.placeholder.com/120'} alt={user.name || 'user'} />
          <div>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'donor'}</p>
          </div>
        </div>
      ) : (
        <p className="fb-empty fb-reveal">No profile data available.</p>
      )}
    </div>
  );
}

export default ProfilePage;

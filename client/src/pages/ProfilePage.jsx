import React from 'react';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="fb-page">
      <h1>Profile</h1>
      {user ? (
        <div className="fb-profile">
          <img src={user.profileImage || user.picture || 'https://via.placeholder.com/120'} alt={user.name || 'user'} />
          <div>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'donor'}</p>
          </div>
        </div>
      ) : (
        <p className="fb-empty">No profile data available.</p>
      )}
    </div>
  );
}

export default ProfilePage;

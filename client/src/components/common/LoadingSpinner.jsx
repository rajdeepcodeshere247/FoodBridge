import React from 'react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="fb-loading" role="status" aria-live="polite">
      <div className="fb-spinner" />
      <p>{label}</p>
    </div>
  );
}

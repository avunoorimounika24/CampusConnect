import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-wrap" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p style={{ marginTop: '14px', color: 'var(--secondary-text)', fontSize: '0.92rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;

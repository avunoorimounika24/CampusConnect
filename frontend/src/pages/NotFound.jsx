import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ padding: '100px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--purple-light)',
          color: 'var(--purple-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Compass size={36} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '8px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '14px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--secondary-text)', marginBottom: '28px' }}>
          The page or campus event resource you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Failed to load data.', onRetry }) => {
  return (
    <div className="alert alert-error" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline-danger btn-sm"
          style={{ background: '#FFF' }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

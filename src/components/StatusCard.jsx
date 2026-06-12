import React from 'react';

export default function StatusCard({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status-container loading-state">
        <div className="spinner"></div>
        <p>{message || 'Loading posts...'}</p>
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="status-container empty-state">
        <h3>No Posts Found</h3>
        <p>{message || 'Try adjusting your search terms.'}</p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="status-container error-state">
        <h3>Error Occurred</h3>
        <p>{message || 'Failed to fetch data from the server.'}</p>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  return null;
}

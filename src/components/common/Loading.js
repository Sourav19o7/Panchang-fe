import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false,
  overlay = false 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const LoadingContent = () => (
    <div className="loading-content">
      <Loader2 className={`loading-spinner ${getSizeClasses()}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-container fullscreen">
        <LoadingContent />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingContent />
      </div>
    );
  }

  return (
    <div className="loading-container">
      <LoadingContent />
    </div>
  );
};

// Inline loading for buttons
export const ButtonLoading = ({ size = 16 }) => (
  <Loader2 className="btn-loading" size={size} />
);

// Card loading skeleton
export const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </div>
    <div className="skeleton-body">
      <div className="skeleton-line long"></div>
      <div className="skeleton-line medium"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
);

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="skeleton-th"></div>
      ))}
    </div>
    <div className="skeleton-table-body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-tr">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-td"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Page loading with progress
export const PageLoading = ({ progress = null, message = 'Loading page...' }) => (
  <div className="page-loading">
    <div className="page-loading-content">
      <Loader2 className="page-loading-spinner" size={48} />
      <h2 className="page-loading-title">{message}</h2>
      {progress !== null && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}
    </div>
  </div>
);

export default Loading;
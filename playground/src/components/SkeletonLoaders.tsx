import React from 'react';

export const SkeletonTrackCard: React.FC = () => {
  return (
    <div className="skeleton-track-card" aria-hidden="true">
      <div className="skeleton-artwork shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-header-row">
          <div className="skeleton-line skeleton-title shimmer" />
          <div className="skeleton-badge shimmer" />
        </div>
        <div className="skeleton-line skeleton-artist shimmer" />
        <div className="skeleton-line skeleton-album shimmer" />
        <div className="skeleton-line skeleton-reason shimmer" />

        <div className="skeleton-footer-row">
          <div className="skeleton-btn shimmer" />
          <div className="skeleton-btn shimmer" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonAIResponse: React.FC = () => {
  return (
    <div className="skeleton-ai-response-box" aria-hidden="true">
      <div className="skeleton-ai-header">
        <div className="skeleton-avatar shimmer" />
        <div className="skeleton-line skeleton-ai-title shimmer" />
      </div>
      <div className="skeleton-line skeleton-text-1 shimmer" />
      <div className="skeleton-line skeleton-text-2 shimmer" />
      <div className="skeleton-line skeleton-text-3 shimmer" />
    </div>
  );
};

export const SkeletonTrackGrid: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="skeleton-track-grid" aria-label="Loading tracks skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonTrackCard key={`skeleton-card-${index}`} />
      ))}
    </div>
  );
};

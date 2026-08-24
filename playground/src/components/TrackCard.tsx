import React, { useState } from 'react';
import { Play, Pause, Music, Info, Sparkles } from 'lucide-react';
import type { TrackRecommendation } from '../types';

interface TrackCardProps {
  recommendation: TrackRecommendation;
  isPlaying: boolean;
  onTogglePlay: (trackId: string) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  recommendation,
  isPlaying,
  onTogglePlay,
}) => {
  const { track, matchScore } = recommendation;
  const [imageError, setImageError] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const getMatchScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'match-badge-high';
    if (score >= 75) return 'match-badge-medium';
    return 'match-badge-standard';
  };

  return (
    <article className="track-card" aria-label={`${track.title} by ${track.artist}`}>
      {/* Artwork Section */}
      <div className="track-artwork-container">
        {!imageError ? (
          <img
            src={track.artwork}
            alt={`${track.album} album cover`}
            className="track-artwork-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="track-artwork-fallback">
            <Music size={32} style={{ opacity: 0.6 }} />
          </div>
        )}

        <button
          type="button"
          onClick={() => onTogglePlay(track.id)}
          className={`track-play-overlay-btn ${isPlaying ? 'playing' : ''}`}
          aria-label={isPlaying ? `Pause ${track.title}` : `Play preview of ${track.title}`}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
        </button>

        {/* AI Match Percentage Badge */}
        <div className={`track-match-badge ${getMatchScoreBadgeClass(matchScore.overall)}`}>
          <Sparkles size={12} />
          <span>{matchScore.overall}% MATCH</span>
        </div>
      </div>

      {/* Track Info Body */}
      <div className="track-card-body">
        <div className="track-header-row">
          <h3 className="track-title" title={track.title}>{track.title}</h3>
        </div>

        <p className="track-artist-line">
          <span>{track.artist}</span> • <span className="track-album-name">{track.album}</span>
        </p>

        {/* Genre & Mood Pills */}
        <div className="track-tags-row">
          {track.genre.slice(0, 2).map((g, idx) => (
            <span key={`genre-${idx}`} className="track-tag-pill genre">
              {g}
            </span>
          ))}
          {track.moods.slice(0, 2).map((m, idx) => (
            <span key={`mood-${idx}`} className="track-tag-pill mood">
              #{m}
            </span>
          ))}
        </div>

        {/* AI Explanation Accordion */}
        <div className="track-explanation-container">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="track-explanation-toggle"
            aria-expanded={showExplanation}
          >
            <Info size={14} />
            <span>Why this track?</span>
          </button>

          {showExplanation && (
            <div className="track-explanation-content">
              <p className="track-explanation-text">
                {track.aiExplanation || 'Matches your requested energy and mood profile.'}
              </p>
              <ul className="track-reasons-list">
                {matchScore.reasons.map((r, i) => (
                  <li key={`reason-${i}`}>✓ {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

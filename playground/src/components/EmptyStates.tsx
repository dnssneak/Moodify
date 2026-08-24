import React from 'react';
import { Sparkles, SearchX, RefreshCw, AlertCircle, WifiOff, ZapOff, Clock, ArrowRight } from 'lucide-react';
import type { AIServiceError, MoodCategory } from '../types';
import { MOCK_MOODS } from '../data/mockDataset';

interface FirstRunEmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
  onSelectMood: (moodId: string) => void;
  selectedMood: string | null;
}

export const FirstRunEmptyState: React.FC<FirstRunEmptyStateProps> = ({
  onSelectPrompt,
  onSelectMood,
  selectedMood,
}) => {
  const quickPrompts = [
    { label: '🚗 Dreamy synthwave for a late night drive', text: 'Dreamy synthwave music for late night driving' },
    { label: '💻 Deep focus lo-fi for coding & studying', text: 'Deep focus lo-fi beats for coding and concentration' },
    { label: '☔ Melancholic piano for rainy evening solitude', text: 'Melancholic piano and soft rain sounds for solitude' },
    { label: '⚡ High-energy workout electronic beats', text: 'High-energy electronic dance beats for gym workout' },
  ];

  return (
    <div className="empty-state first-run-empty-state">
      <div className="empty-state-icon-wrapper">
        <Sparkles className="empty-state-hero-icon" size={36} />
      </div>

      <h2 className="empty-state-title">Turn how you feel into what you listen to</h2>
      <p className="empty-state-subtitle">
        Type a natural language prompt or pick a mood chip below to start discovering music matched to your atmosphere.
      </p>

      {/* Mood Chip Selector */}
      <div className="mood-chips-container">
        <h4 className="chip-section-label">Select Mood Atmosphere:</h4>
        <div className="mood-chips-grid">
          {MOCK_MOODS.map((mood: MoodCategory) => (
            <button
              type="button"
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
              style={{
                borderColor: selectedMood === mood.id ? mood.color : undefined,
                boxShadow: selectedMood === mood.id ? `0 0 12px ${mood.color}40` : undefined,
              }}
            >
              <span className="mood-chip-icon">{mood.icon}</span>
              <span className="mood-chip-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="quick-prompts-container">
        <h4 className="chip-section-label">Or Try Quick Prompt Intent Chips:</h4>
        <div className="quick-prompts-list">
          {quickPrompts.map((item, index) => (
            <button
              type="button"
              key={`prompt-chip-${index}`}
              onClick={() => onSelectPrompt(item.text)}
              className="quick-prompt-btn"
            >
              <span>{item.label}</span>
              <ArrowRight size={14} className="prompt-arrow-icon" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NoResultsEmptyStateProps {
  query: string;
  onResetSearch: () => void;
  onTryFallback: () => void;
}

export const NoResultsEmptyState: React.FC<NoResultsEmptyStateProps> = ({
  query,
  onResetSearch,
  onTryFallback,
}) => {
  return (
    <div className="empty-state no-results-empty-state" role="status">
      <div className="empty-state-icon-wrapper warning">
        <SearchX className="empty-state-hero-icon" size={36} />
      </div>

      <h3 className="empty-state-title">No exact track matches found</h3>
      <p className="empty-state-subtitle">
        We searched our curated catalog for <strong>"{query || 'your filter combination'}"</strong>, but no candidate tracks satisfied all constraints.
      </p>

      <div className="next-actions-group">
        <button type="button" onClick={onResetSearch} className="custom-btn-secondary">
          <RefreshCw size={16} />
          Reset Search Prompt
        </button>

        <button type="button" onClick={onTryFallback} className="custom-btn-primary">
          <Sparkles size={16} />
          Try AI Fallback Recommendation Engine
        </button>
      </div>
    </div>
  );
};

interface AIFailureStateCardProps {
  error: AIServiceError;
  retryCount: number;
  partialText?: string;
  onRetry: () => void;
  onFallback: () => void;
  onReset: () => void;
}

export const AIFailureStateCard: React.FC<AIFailureStateCardProps> = ({
  error,
  retryCount,
  partialText,
  onRetry,
  onFallback,
  onReset,
}) => {
  const getErrorIcon = () => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return <WifiOff size={24} className="error-card-icon network" />;
      case 'STREAM_INTERRUPTED':
        return <ZapOff size={24} className="error-card-icon stream" />;
      case 'RATE_LIMIT_429':
        return <Clock size={24} className="error-card-icon ratelimit" />;
      default:
        return <AlertCircle size={24} className="error-card-icon general" />;
    }
  };

  return (
    <div className="ai-failure-card" role="alert" aria-live="polite">
      <div className="failure-header">
        <div className="failure-title-group">
          {getErrorIcon()}
          <div>
            <h4 className="failure-title">{error.message}</h4>
            <span className="failure-code-badge">ErrorCode: {error.code}</span>
          </div>
        </div>
        {retryCount > 0 && <span className="retry-badge">Retried {retryCount}x</span>}
      </div>

      <p className="failure-details">{error.details}</p>

      {/* Partial Stream Display if Stream Interrupted */}
      {error.code === 'STREAM_INTERRUPTED' && partialText && (
        <div className="partial-stream-box">
          <h5 className="partial-stream-heading">Partial Received AI Stream Output:</h5>
          <pre className="partial-stream-content">{partialText}</pre>
        </div>
      )}

      <div className="failure-actions">
        {error.retryable && (
          <button type="button" onClick={onRetry} className="custom-btn-primary">
            <RefreshCw size={16} />
            {error.code === 'STREAM_INTERRUPTED' ? 'Resume / Retry Stream' : 'Retry Request'}
          </button>
        )}

        {error.code === 'RATE_LIMIT_429' && (
          <button type="button" onClick={onFallback} className="custom-btn-secondary">
            <Sparkles size={16} />
            Switch to Client-Side Fallback Engine
          </button>
        )}

        <button type="button" onClick={onReset} className="custom-btn-text">
          Dismiss
        </button>
      </div>
    </div>
  );
};

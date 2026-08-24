import React, { useState, useRef } from 'react';
import { Send, X, Sparkles, SlidersHorizontal, Volume2 } from 'lucide-react';
import { useAIMoodChat } from '../hooks/useAIMoodChat';
import { SabotageControlPanel } from './SabotageControlPanel';
import { SkeletonTrackGrid, SkeletonAIResponse } from './SkeletonLoaders';
import { FirstRunEmptyState, NoResultsEmptyState, AIFailureStateCard } from './EmptyStates';
import { TrackCard } from './TrackCard';

interface AIDiscoveryFlowProps {
  onTriggerBoundaryCrash?: () => void;
}

export const AIDiscoveryFlow: React.FC<AIDiscoveryFlowProps> = ({ onTriggerBoundaryCrash }) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [activePlayingTrackId, setActivePlayingTrackId] = useState<string | null>(null);
  const [showSabotagePanel, setShowSabotagePanel] = useState<boolean>(true);

  // Web Audio Synth audio player ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscillatorRef = useRef<OscillatorNode | null>(null);

  const {
    status,
    streamedText,
    responseData,
    error,
    retryCount,
    sabotageConfig,
    setSabotageConfig,
    generateRecommendations,
    retry,
    fallbackToLocalMatching,
    resetAllState,
  } = useAIMoodChat();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations(promptInput, selectedMoodId);
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setPromptInput(promptText);
    generateRecommendations(promptText, selectedMoodId);
  };

  const handleSelectMood = (moodId: string) => {
    const nextMood = selectedMoodId === moodId ? null : moodId;
    setSelectedMoodId(nextMood);
    generateRecommendations(promptInput, nextMood);
  };

  const handleClear = () => {
    setPromptInput('');
    setSelectedMoodId(null);
    resetAllState();
  };

  // Synthetic Audio Preview Synthesizer (Web Audio API)
  const handleTogglePlayTrack = (trackId: string) => {
    if (activePlayingTrackId === trackId) {
      // Stop current playback
      if (activeOscillatorRef.current) {
        try {
          activeOscillatorRef.current.stop();
        } catch {
          // ignore
        }
        activeOscillatorRef.current = null;
      }
      setActivePlayingTrackId(null);
      return;
    }

    // Stop existing tone
    if (activeOscillatorRef.current) {
      try {
        activeOscillatorRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Initialize Audio Context
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Select harmonic frequency based on track ID length
    const frequencies = [261.63, 329.63, 392.00, 523.25, 440.00];
    const freq = frequencies[trackId.length % frequencies.length];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 3.0);

    activeOscillatorRef.current = osc;
    setActivePlayingTrackId(trackId);

    setTimeout(() => {
      setActivePlayingTrackId((prev) => (prev === trackId ? null : prev));
    }, 3000);
  };

  return (
    <div className="ai-discovery-container">
      {/* Header Toolbar & Sabotage Toggle Button */}
      <div className="ai-discovery-toolbar">
        <div className="toolbar-info">
          <Sparkles className="toolbar-icon" size={20} />
          <span className="toolbar-title">AI Natural Language Music Curator</span>
        </div>

        <button
          type="button"
          onClick={() => setShowSabotagePanel(!showSabotagePanel)}
          className="sabotage-toggle-panel-btn"
        >
          <SlidersHorizontal size={16} />
          <span>{showSabotagePanel ? 'Hide Sabotage Controls' : 'Show Sabotage Controls'}</span>
        </button>
      </div>

      {/* Embedded Sabotage Panel */}
      {showSabotagePanel && (
        <SabotageControlPanel
          config={sabotageConfig}
          onChange={setSabotageConfig}
          onResetAll={() =>
            setSabotageConfig({
              forceNetworkError: false,
              interruptStream: false,
              forceRateLimit: false,
              slowResponse: false,
              forceZeroResults: false,
              throwBoundaryError: false,
            })
          }
          onTriggerBoundaryCrash={onTriggerBoundaryCrash}
        />
      )}

      {/* Main Search & Prompt Input Form */}
      <form onSubmit={handleSearchSubmit} className="prompt-input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe your mood, activity, or desired atmosphere... (e.g. 'dreamy synthwave for late night drive')"
            className="custom-prompt-input"
            aria-label="AI Music Prompt Input"
          />

          {promptInput && (
            <button type="button" onClick={handleClear} className="input-clear-btn" aria-label="Clear Input">
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'streaming'}
            className="custom-btn-primary submit-prompt-btn"
          >
            <Send size={16} />
            <span>Discover</span>
          </button>
        </div>
      </form>

      {/* Active Failure / Error Handling State Card */}
      {error && (
        <AIFailureStateCard
          error={error}
          retryCount={retryCount}
          partialText={streamedText}
          onRetry={retry}
          onFallback={fallbackToLocalMatching}
          onReset={handleClear}
        />
      )}

      {/* Pending Loading & Skeletons State */}
      {status === 'loading' && (
        <div className="pending-state-container">
          <SkeletonAIResponse />
          <SkeletonTrackGrid count={3} />
        </div>
      )}

      {/* Streaming Output State */}
      {status === 'streaming' && (
        <div className="streaming-state-container">
          <div className="streaming-box">
            <div className="streaming-header">
              <Sparkles size={16} className="streaming-pulse-icon" />
              <span>AI Music Agent Streaming Intent Analysis...</span>
            </div>
            <pre className="streaming-content">
              {streamedText}
              <span className="streaming-cursor">▌</span>
            </pre>
          </div>
          <SkeletonTrackGrid count={3} />
        </div>
      )}

      {/* Initial Idle State (First-Run Empty State) */}
      {status === 'idle' && !error && (
        <FirstRunEmptyState
          onSelectPrompt={handleSelectQuickPrompt}
          onSelectMood={handleSelectMood}
          selectedMood={selectedMoodId}
        />
      )}

      {/* Success State with Results or Zero Results Empty State */}
      {status === 'success' && responseData && (
        <div className="discovery-results-section">
          {/* Intent Summary Banner */}
          <div className="intent-summary-bar">
            <div className="intent-tags">
              <span className="intent-badge mood">Mood: {responseData.extractedIntent.mood}</span>
              <span className="intent-badge energy">Energy Target: {responseData.extractedIntent.energy}%</span>
              <span className="intent-badge activity">Context: {responseData.extractedIntent.activity}</span>
              {responseData.isFallback && <span className="intent-badge fallback">Client-Side Fallback</span>}
            </div>
            <p className="intent-summary-text">{responseData.summary}</p>
          </div>

          {/* Zero Results State */}
          {responseData.recommendations.length === 0 ? (
            <NoResultsEmptyState
              query={promptInput}
              onResetSearch={handleClear}
              onTryFallback={fallbackToLocalMatching}
            />
          ) : (
            /* Recommended Tracks Grid */
            <div className="track-grid-container">
              <div className="section-title-row">
                <h3 className="section-title">AI Matched Tracks ({responseData.recommendations.length})</h3>
                {activePlayingTrackId && (
                  <div className="audio-indicator-badge">
                    <Volume2 size={14} className="sound-wave-icon" />
                    <span>Playing Audio Tone Preview...</span>
                  </div>
                )}
              </div>

              <div className="track-card-grid">
                {responseData.recommendations.map((rec) => (
                  <TrackCard
                    key={rec.track.id}
                    recommendation={rec}
                    isPlaying={activePlayingTrackId === rec.track.id}
                    onTogglePlay={handleTogglePlayTrack}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

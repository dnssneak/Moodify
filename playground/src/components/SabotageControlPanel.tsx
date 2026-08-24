import React from 'react';
import { ShieldAlert, WifiOff, ZapOff, Clock, SearchX, Bomb, RefreshCw } from 'lucide-react';
import type { SabotageConfig } from '../types';

interface SabotageControlPanelProps {
  config: SabotageConfig;
  onChange: (newConfig: SabotageConfig) => void;
  onResetAll: () => void;
  onTriggerBoundaryCrash?: () => void;
}

export const SabotageControlPanel: React.FC<SabotageControlPanelProps> = ({
  config,
  onChange,
  onResetAll,
  onTriggerBoundaryCrash,
}) => {
  const toggle = (key: keyof SabotageConfig) => {
    onChange({
      ...config,
      [key]: !config[key],
    });
  };

  const hasActiveSabotage = Object.values(config).some(Boolean);

  return (
    <aside className="sabotage-panel" aria-label="Sabotage Edge Case Testing Panel">
      <div className="sabotage-header">
        <div className="sabotage-title-group">
          <ShieldAlert className="sabotage-icon" size={18} />
          <h3 className="sabotage-title">Edge Case Sabotage Suite</h3>
        </div>
        <span className={`sabotage-badge ${hasActiveSabotage ? 'active' : 'idle'}`}>
          {hasActiveSabotage ? 'SABOTAGE ACTIVE' : 'HAPPY PATH'}
        </span>
      </div>

      <p className="sabotage-subtitle">
        Toggle simulated failure modes to test FE-08 resilience &amp; recovery mechanisms:
      </p>

      <div className="sabotage-grid">
        {/* Toggle 1: Network Error */}
        <label className={`sabotage-toggle-card ${config.forceNetworkError ? 'selected' : ''}`}>
          <div className="toggle-label-text">
            <WifiOff size={16} className="toggle-icon network" />
            <span>Force Network Error</span>
          </div>
          <input
            type="checkbox"
            checked={config.forceNetworkError}
            onChange={() => toggle('forceNetworkError')}
          />
        </label>

        {/* Toggle 2: Stream Interruption */}
        <label className={`sabotage-toggle-card ${config.interruptStream ? 'selected' : ''}`}>
          <div className="toggle-label-text">
            <ZapOff size={16} className="toggle-icon stream" />
            <span>Interrupt Stream Mid-Way</span>
          </div>
          <input
            type="checkbox"
            checked={config.interruptStream}
            onChange={() => toggle('interruptStream')}
          />
        </label>

        {/* Toggle 3: Rate Limit 429 */}
        <label className={`sabotage-toggle-card ${config.forceRateLimit ? 'selected' : ''}`}>
          <div className="toggle-label-text">
            <Clock size={16} className="toggle-icon ratelimit" />
            <span>Rate Limit (429 Error)</span>
          </div>
          <input
            type="checkbox"
            checked={config.forceRateLimit}
            onChange={() => toggle('forceRateLimit')}
          />
        </label>

        {/* Toggle 4: Slow Network */}
        <label className={`sabotage-toggle-card ${config.slowResponse ? 'selected' : ''}`}>
          <div className="toggle-label-text">
            <Clock size={16} className="toggle-icon slow" />
            <span>Slow Response (3.5s Delay)</span>
          </div>
          <input
            type="checkbox"
            checked={config.slowResponse}
            onChange={() => toggle('slowResponse')}
          />
        </label>

        {/* Toggle 5: Zero Results */}
        <label className={`sabotage-toggle-card ${config.forceZeroResults ? 'selected' : ''}`}>
          <div className="toggle-label-text">
            <SearchX size={16} className="toggle-icon zero" />
            <span>Force Zero Match Results</span>
          </div>
          <input
            type="checkbox"
            checked={config.forceZeroResults}
            onChange={() => toggle('forceZeroResults')}
          />
        </label>

        {/* Toggle 6: React Boundary Crash */}
        <button
          type="button"
          onClick={onTriggerBoundaryCrash}
          className="sabotage-crash-btn"
          title="Throws an unhandled runtime error to test ErrorBoundary.tsx"
        >
          <Bomb size={16} />
          <span>Throw Route Failure</span>
        </button>
      </div>

      {hasActiveSabotage && (
        <div className="sabotage-footer">
          <button type="button" onClick={onResetAll} className="reset-sabotage-btn">
            <RefreshCw size={14} />
            Clear All Sabotage Toggles
          </button>
        </div>
      )}
    </aside>
  );
};

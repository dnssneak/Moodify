import React, { useState } from 'react';
import { Settings, Sparkles, Volume2, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, clearUserData } = useUserStore();
  const [synthEnabled, setSynthEnabled] = useState(true);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [cleared, setCleared] = useState(false);

  const handleDiversityChange = (mode: 'balanced' | 'exploratory' | 'focused') => {
    updatePreferences({ recommendationDiversity: mode });
  };

  const handleClear = () => {
    clearUserData();
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32 text-[#E1E0CC]">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#DEDBC8]" /> App & Audio Settings
        </h1>
        <p className="text-xs md:text-sm text-gray-400">Configure Web Audio API synthesizer, AI recommendation tuning, and listening preferences.</p>
      </div>

      {/* Audio & Synthesizer Preferences Card */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/15 glass-panel flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center gap-2 text-sm font-bold text-[#DEDBC8] uppercase tracking-wider">
          <Volume2 className="w-4 h-4 text-[#DEDBC8]" /> Audio & Synthesizer Engine
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <h4 className="text-sm font-bold text-[#E1E0CC]">Web Audio Synthesizer Live Previews</h4>
              <p className="text-xs text-gray-400 mt-0.5">Generates live harmonic chords using browser oscillator nodes when playing tracks</p>
            </div>
            <button
              onClick={() => setSynthEnabled(!synthEnabled)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                synthEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {synthEnabled ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <h4 className="text-sm font-bold text-[#E1E0CC]">3D Spatial Audio Simulation</h4>
              <p className="text-xs text-gray-400 mt-0.5">Enables binaural audio filter effects for 3D visualizer scenes</p>
            </div>
            <button
              onClick={() => setSpatialAudio(!spatialAudio)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                spatialAudio
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {spatialAudio ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Vector Curation Tuning */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/15 glass-panel flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center gap-2 text-sm font-bold text-[#DEDBC8] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#DEDBC8]" /> AI Curation & Vector Tuning
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-gray-400">Discovery Diversity Mode:</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'balanced', label: 'Balanced Discovery', desc: 'Mix of exact mood matches & fresh recommendations' },
              { id: 'focused', label: 'Strict Focus', desc: 'Strict adherence to specific energy & mood levels' },
              { id: 'exploratory', label: 'Exploratory Adventurous', desc: 'Pushes boundaries with unexpected sonic crossovers' },
            ].map((item) => {
              const isSelected = (preferences.recommendationDiversity || 'balanced') === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleDiversityChange(item.id as any)}
                  className={`flex flex-col p-4 rounded-2xl border text-left transition-all cursor-pointer flex-1 min-w-[200px] ${
                    isSelected
                      ? 'border-[#DEDBC8] bg-[#DEDBC8]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#DEDBC8]' : 'text-[#E1E0CC]'}`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage & Privacy Reset */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/15 glass-panel flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#DEDBC8] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#DEDBC8]" /> Data & Cache Management
            </div>
            <p className="text-xs text-gray-400 mt-1">Clear local listening history, recent searches, and saved preferences.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset Local Data
            </button>
            {cleared && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Reset complete!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

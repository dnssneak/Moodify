import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, Compass, RefreshCw } from 'lucide-react';
import { MOODS } from '../data/moods';
import { GENRES } from '../data/genres';
import { AIInput } from '../components/ai/AIInput';
import { AIThinking } from '../components/ai/AIThinking';
import { TrackGrid } from '../components/music/TrackGrid';
import { AIService } from '../services/aiService';
import { RecommendationService } from '../services/recommendationService';
import { useUserStore } from '../store/useUserStore';
import type { Track, AIRecommendation } from '../types/music';

import { MoodIcon } from '../components/music/MoodIcon';
import { GenreIcon } from '../components/music/GenreIcon';

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialMood = searchParams.get('mood') || '';

  const { preferences, addRecentSearch } = useUserStore();

  const [prompt, setPrompt] = useState(initialQuery);
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood || null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [energyFilter, setEnergyFilter] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<{ track: Track; recommendation: AIRecommendation }[]>([]);

  useEffect(() => {
    if (initialQuery) {
      handlePerformAISearch(initialQuery);
    } else if (initialMood) {
      setSelectedMood(initialMood);
      const recs = RecommendationService.getRecommendations(undefined, initialMood, preferences);
      setRecommendations(recs);
    } else {
      const recs = RecommendationService.getRecommendations(undefined, undefined, preferences);
      setRecommendations(recs);
    }
  }, [initialQuery, initialMood]);

  const handlePerformAISearch = async (queryText: string) => {
    setPrompt(queryText);
    addRecentSearch(queryText);
    setIsGenerating(true);

    try {
      const recs = await AIService.recommendForPrompt(queryText, preferences.aiProviderKey, preferences);
      setRecommendations(recs);
    } catch (e) {
      console.warn('Discovery fallback:', e);
      const recs = RecommendationService.getRecommendations(queryText, selectedMood || undefined, preferences);
      setRecommendations(recs);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMoodFilter = (moodId: string) => {
    const nextMood = selectedMood === moodId ? null : moodId;
    setSelectedMood(nextMood);
    if (nextMood) {
      setSearchParams({ mood: nextMood });
    } else {
      setSearchParams({});
    }
    const recs = RecommendationService.getRecommendations(prompt || undefined, nextMood || undefined, preferences);
    setRecommendations(recs);
  };

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => {
      if (selectedGenre && !item.track.genre.includes(selectedGenre)) return false;
      if (energyFilter && Math.abs(item.track.energy - energyFilter) > 40) return false;
      return true;
    });
  }, [recommendations, selectedGenre, energyFilter]);

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32 text-[#E1E0CC]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
          <Compass className="w-8 h-8 text-[#DEDBC8]" /> Natural Language AI Discovery
        </h1>
        <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
          Search with natural language or refine your sonic discovery using mood, energy, and genre filters.
        </p>
      </div>

      {/* AI Prompt Input Bar */}
      <section className="p-6 md:p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl">
        <AIInput onSearch={handlePerformAISearch} isGenerating={isGenerating} />
      </section>

      {/* Filters Bar */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#E1E0CC] flex items-center gap-2 uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-[#DEDBC8]" /> Discovery Filters
          </span>
          {(selectedMood || selectedGenre || energyFilter !== 50) && (
            <button
              onClick={() => {
                setSelectedMood(null);
                setSelectedGenre(null);
                setEnergyFilter(50);
                setSearchParams({});
              }}
              className="text-xs font-semibold text-[#DEDBC8] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Mood Pills */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-400">Mood Selector:</span>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMoodFilter(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedMood === m.id
                    ? 'bg-[#DEDBC8] text-black font-bold shadow-md scale-[1.02]'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <MoodIcon moodId={m.id} className="w-3.5 h-3.5" />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Genre & Energy Slider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-4">
          {/* Genre Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-400">Genre Selector:</span>
            <div className="flex flex-wrap gap-2">
              {GENRES.slice(0, 8).map((g: string) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedGenre === g
                      ? 'bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/60 font-bold'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <GenreIcon genre={g} className="w-3.5 h-3.5" />
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
              <span>Energy Preference:</span>
              <span className="text-[#DEDBC8] font-bold font-mono">{energyFilter}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energyFilter}
              onChange={(e) => setEnergyFilter(parseInt(e.target.value))}
              className="w-full accent-[#DEDBC8] h-1.5 bg-white/10 rounded-lg cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Calm / Ambient</span>
              <span>Balanced</span>
              <span>High Energy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Header & Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#E1E0CC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#DEDBC8]" /> AI Recommended Tracks ({filteredRecommendations.length})
          </h2>
        </div>

        {isGenerating ? (
          <AIThinking step="Extracting intent & matching mood vectors..." />
        ) : filteredRecommendations.length > 0 ? (
          <TrackGrid
            tracks={filteredRecommendations.map((r) => r.track)}
            recommendations={filteredRecommendations}
          />
        ) : (
          <div className="text-center p-12 rounded-2xl text-gray-400 bg-[#101010] border border-white/5">
            No track matches found for current filter criteria. Try adjusting your energy slider or resetting filters.
          </div>
        )}
      </section>
    </div>
  );
};

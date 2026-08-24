import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Radio } from 'lucide-react';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingAbout } from '../components/landing/LandingAbout';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { MOODS } from '../data/moods';
import { TrackGrid } from '../components/music/TrackGrid';
import { RecommendationService } from '../services/recommendationService';
import { useUserStore } from '../store/useUserStore';
import { usePlaylistStore } from '../store/usePlaylistStore';

import { MoodIcon } from '../components/music/MoodIcon';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUserStore();
  const { playlists } = usePlaylistStore();

  const handleAISearch = (prompt: string) => {
    navigate(`/discover?q=${encodeURIComponent(prompt)}`);
  };

  const topRecommendations = useMemo(() => {
    return RecommendationService.getRecommendations(undefined, undefined, preferences).slice(0, 6);
  }, [preferences]);

  return (
    <div className="flex flex-col bg-black text-[#E1E0CC] w-full min-h-screen">
      {/* Section 1: Hero */}
      <LandingHero onSearchSubmit={handleAISearch} brandName="Moodify" />

      {/* Section 2: About AI Curator */}
      <LandingAbout />

      {/* Section 3: Features */}
      <LandingFeatures />

      {/* Section 4: AI Recommendations & Mood Selector Section */}
      <section className="w-full bg-black py-16 md:py-24 px-4 md:px-12 flex justify-center scroll-mt-28">
        <div className="w-full max-w-7xl flex flex-col gap-14">
          {/* Mood Selector Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-2.5">
                <Compass className="w-7 h-7 text-[#DEDBC8]" /> What are you feeling today?
              </h2>
              <button
                onClick={() => navigate('/discover')}
                className="text-xs font-semibold text-[#DEDBC8] hover:text-white transition-colors"
              >
                Explore all moods →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MOODS.slice(0, 10).map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => navigate(`/discover?mood=${mood.id}`)}
                  className="flex flex-col p-4 rounded-2xl border border-white/10 glass-card text-left transition-all group cursor-pointer shadow-lg hover:border-[#DEDBC8]/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DEDBC8]/15 text-[#DEDBC8] mb-3 group-hover:scale-110 group-hover:bg-[#DEDBC8] group-hover:text-black transition-all">
                    <MoodIcon moodId={mood.id} className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-[#E1E0CC] group-hover:text-[#DEDBC8] transition-colors">
                    {mood.name}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate mt-0.5">{mood.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommended Tracks Grid */}
          <div className="flex flex-col gap-5 pt-8 border-t border-white/10 scroll-mt-28">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-2.5">
                  <Sparkles className="w-7 h-7 text-[#DEDBC8]" /> Curated for Your Vibe
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">AI vector recommendations based on your taste profile</p>
              </div>
            </div>

            <TrackGrid
              tracks={topRecommendations.map((r) => r.track)}
              recommendations={topRecommendations}
            />
          </div>

          {/* Featured AI Playlists Grid */}
          <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-normal text-[#E1E0CC] flex items-center gap-2">
                <Radio className="w-6 h-6 text-[#DEDBC8]" /> Featured AI Playlists
              </h2>
              <button
                onClick={() => navigate('/playlists')}
                className="text-xs font-semibold text-[#DEDBC8] hover:text-white transition-colors"
              >
                View all playlists →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => navigate('/playlists')}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#212121] hover:border-[#DEDBC8]/50 cursor-pointer group shadow-lg transition-all"
                >
                  <img
                    src={playlist.artwork}
                    alt={playlist.name}
                    className="h-16 w-16 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#DEDBC8]/20 text-[#DEDBC8] uppercase">
                        {playlist.mood}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#E1E0CC] group-hover:text-[#DEDBC8] truncate mt-1">
                      {playlist.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{playlist.tracks.length} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

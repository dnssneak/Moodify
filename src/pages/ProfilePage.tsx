import React from 'react';
import { User, Sparkles, Heart, ListMusic, Music2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { usePlaylistStore } from '../store/usePlaylistStore';

export const ProfilePage: React.FC = () => {
  const { preferences, favorites, recentlyPlayed } = useUserStore();
  const { playlists } = usePlaylistStore();

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32 text-[#E1E0CC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
            <User className="w-8 h-8 text-[#DEDBC8]" /> User Profile & Taste Matrix
          </h1>
          <p className="text-xs md:text-sm text-gray-400">View your music preferences and personalized AI taste profile.</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-8 rounded-3xl border border-white/15 glass-panel flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#DEDBC8] text-black font-extrabold text-3xl shadow-xl">
          M
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/30">
              Free Tier
            </span>
            <span className="text-xs text-gray-400">Member since 2026</span>
          </div>

          <h2 className="text-2xl font-bold text-[#E1E0CC]">Moodify Listener</h2>
          <p className="text-xs text-gray-300">
            Taste Profile: Loves Ambient, Synthwave, and Instrumental study soundscapes.
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Heart className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E1E0CC]">{favorites.length}</div>
            <div className="text-xs text-gray-400">Liked Songs</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#212121] border border-white/5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DEDBC8]/10 text-[#DEDBC8]">
            <ListMusic className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E1E0CC]">{playlists.length}</div>
            <div className="text-xs text-gray-400">Custom Playlists</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#212121] border border-white/5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E1E0CC]">{recentlyPlayed.length}</div>
            <div className="text-xs text-gray-400">Tracks Streamed</div>
          </div>
        </div>
      </div>

      {/* Preferences Matrix */}
      <div className="p-6 rounded-3xl border border-white/10 bg-[#101010] flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#E1E0CC] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#DEDBC8]" /> Preferred Genres & Mood Matrix
        </h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.favoriteGenres.map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-xl bg-[#212121] text-xs font-semibold text-[#DEDBC8] border border-white/5"
            >
              {g}
            </span>
          ))}
          {preferences.preferredMoods.map((m) => (
            <span
              key={m}
              className="px-3 py-1 rounded-xl bg-[#212121] text-xs font-semibold text-gray-300 border border-white/5"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

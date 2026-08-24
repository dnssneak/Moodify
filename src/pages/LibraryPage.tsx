import React, { useState } from 'react';
import { Library, Heart, ListMusic, History, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { MOCK_TRACKS } from '../data/tracks';
import { TrackGrid } from '../components/music/TrackGrid';
import { useNavigate } from 'react-router-dom';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'favorites' | 'playlists' | 'recent'>('favorites');
  const { favorites, recentlyPlayed, recentSearches } = useUserStore();
  const { playlists } = usePlaylistStore();

  const favTracks = MOCK_TRACKS.filter((t) => favorites.includes(t.id));
  const recentTracks = MOCK_TRACKS.filter((t) => recentlyPlayed.includes(t.id));

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-6 pb-32 text-[#E1E0CC]">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
          <Library className="w-8 h-8 text-[#DEDBC8]" /> My Library
        </h1>
        <p className="text-xs md:text-sm text-gray-400">Centralized hub for your playlists, liked songs, and discovery history.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-[#DEDBC8] text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'text-black' : 'text-rose-400'}`} /> Favorites ({favTracks.length})
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'playlists'
              ? 'bg-[#DEDBC8] text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <ListMusic className="w-4 h-4 text-[#DEDBC8]" /> Playlists ({playlists.length})
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'recent'
              ? 'bg-[#DEDBC8] text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <History className="w-4 h-4 text-amber-400" /> History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && <TrackGrid tracks={favTracks} />}

      {activeTab === 'playlists' && (
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
                <h3 className="font-bold text-sm text-[#E1E0CC] group-hover:text-[#DEDBC8] truncate mt-1">
                  {playlist.name}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{playlist.tracks.length} tracks</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#DEDBC8]" /> Recent Search Queries
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/discover?q=${encodeURIComponent(s)}`)}
                  className="px-3 py-1.5 rounded-xl bg-[#212121] text-xs text-[#E1E0CC] border border-white/5 hover:border-[#DEDBC8]/40 hover:text-[#DEDBC8] cursor-pointer"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              Recently Explored Tracks
            </h3>
            <TrackGrid tracks={recentTracks.length > 0 ? recentTracks : MOCK_TRACKS.slice(0, 6)} />
          </div>
        </div>
      )}
    </div>
  );
};

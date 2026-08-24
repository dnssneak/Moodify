import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Music2, Users } from 'lucide-react';
import { MOCK_ARTISTS } from '../data/artists';
import { MOCK_TRACKS } from '../data/tracks';
import { TrackGrid } from '../components/music/TrackGrid';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const artist = MOCK_ARTISTS.find((a) => a.id === id) || MOCK_ARTISTS[0];
  const artistTracks = MOCK_TRACKS.filter((t) => artist.popularTracks.includes(t.id));

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32 text-[#E1E0CC]">
      <button
        onClick={() => navigate('/artists')}
        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Artists
      </button>

      {/* Artist Hero Panel */}
      <div className="p-8 rounded-3xl border border-white/15 glass-panel flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <img
          src={artist.image}
          alt={artist.name}
          className="h-44 w-44 rounded-2xl object-cover shadow-2xl border border-white/10"
        />

        <div className="flex flex-col gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {artist.genres.map((g) => (
              <span key={g} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/30">
                {g}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-[#E1E0CC]">{artist.name}</h1>
          <p className="text-xs text-gray-300 leading-relaxed">{artist.bio}</p>

          {/* AI Insight Box */}
          <div className="rounded-2xl bg-black/60 p-4 border border-white/10 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DEDBC8] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#DEDBC8]" /> AI Taste Insight
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{artist.aiInsight}</p>
          </div>
        </div>
      </div>

      {/* Popular Tracks Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#E1E0CC] flex items-center gap-2">
          <Music2 className="w-5 h-5 text-[#DEDBC8]" /> Popular Tracks by {artist.name}
        </h2>
        <TrackGrid tracks={artistTracks} />
      </div>

      {/* Similar Artists Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#E1E0CC] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#DEDBC8]" /> Similar Stylistic Artists
        </h2>
        <div className="flex flex-wrap gap-2">
          {artist.similarArtists.map((sa, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-xl bg-[#212121] text-xs font-medium text-gray-300 border border-white/5"
            >
              {sa}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

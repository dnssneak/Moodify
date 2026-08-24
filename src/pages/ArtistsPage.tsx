import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_ARTISTS } from '../data/artists';

export const ArtistsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-6 pb-32 text-[#E1E0CC]">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
          <Users className="w-8 h-8 text-[#DEDBC8]" /> Artists Exploration
        </h1>
        <p className="text-xs md:text-sm text-gray-400">Discover creators behind Moodify soundscapes and view AI taste insights.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {MOCK_ARTISTS.map((artist) => (
          <div
            key={artist.id}
            onClick={() => navigate(`/artists/${artist.id}`)}
            className="flex flex-col p-6 rounded-3xl border border-white/10 glass-card hover:border-[#DEDBC8]/50 cursor-pointer group shadow-xl transition-all"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-white/10">
              <img
                src={artist.image}
                alt={artist.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/30">
                {artist.genres[0]}
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#E1E0CC] group-hover:text-[#DEDBC8] transition-colors">
              {artist.name}
            </h2>
            <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">{artist.bio}</p>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#DEDBC8] font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#DEDBC8]" /> AI Taste Insight
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

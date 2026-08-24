import React from 'react';
import { Heart, Play } from 'lucide-react';
import { MOCK_TRACKS } from '../data/tracks';
import { useUserStore } from '../store/useUserStore';
import { useMusicStore } from '../store/useMusicStore';
import { TrackGrid } from '../components/music/TrackGrid';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useUserStore();
  const { playTrack } = useMusicStore();

  const favTracks = MOCK_TRACKS.filter((t) => favorites.includes(t.id));

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-6 pb-32 text-[#E1E0CC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-400 stroke-[2]" /> Favorites ({favTracks.length})
          </h1>
          <p className="text-xs md:text-sm text-gray-400">All the tracks you have liked and saved to your personal collection.</p>
        </div>

        {favTracks.length > 0 && (
          <button
            onClick={() => playTrack(favTracks[0])}
            className="btn-primary py-2.5 px-5 text-xs shadow-xl"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" /> Play All Favorites
          </button>
        )}
      </div>

      {favTracks.length > 0 ? (
        <TrackGrid tracks={favTracks} />
      ) : (
        <div className="p-12 rounded-3xl text-center text-gray-400 bg-[#101010] border border-white/5 flex flex-col items-center gap-3">
          <Heart className="w-12 h-12 text-gray-600" />
          <h3 className="text-base font-bold text-[#E1E0CC]">No favorite tracks yet</h3>
          <p className="text-xs max-w-sm text-gray-400">
            Click the heart icon on any track card during your music discovery to save it here.
          </p>
        </div>
      )}
    </div>
  );
};

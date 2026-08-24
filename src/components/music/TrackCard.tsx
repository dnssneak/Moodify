import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, Info, Disc } from 'lucide-react';
import type { Track, AIRecommendation } from '../../types/music';
import { useMusicStore } from '../../store/useMusicStore';
import { useUserStore } from '../../store/useUserStore';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { MatchScore } from './MatchScore';

interface TrackCardProps {
  track: Track;
  recommendation?: AIRecommendation;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, recommendation }) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, openTrackModal } = useMusicStore();
  const { isFavorite, toggleFavorite } = useUserStore();
  const { playlists, addTrackToPlaylist } = usePlaylistStore();

  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isFav = isFavorite(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTrackModal(track, recommendation);
  };

  return (
    <div className="h-full select-none">
      <div
        className="group relative flex flex-col h-full justify-between overflow-hidden rounded-2xl p-4 glass-card border border-white/10 cursor-pointer shadow-xl transition-all duration-300 hover:border-[#DEDBC8]/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#DEDBC8]/5"
        onClick={handleDetailClick}
      >
        {/* 3D Artwork & Spinning Vinyl Record Container */}
        <div className="relative aspect-square w-full flex-shrink-0 rounded-xl bg-black overflow-hidden border border-white/10 shadow-md">
          {/* 3D Vinyl Disc sliding out on hover */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-[85%] rounded-full vinyl-disc flex items-center justify-center transition-all duration-500 ease-out z-0 ${
              isCurrentTrack && isPlaying ? 'translate-x-1/2 rotate-180 animate-spin' : 'group-hover:translate-x-1/3 group-hover:rotate-45'
            }`}
            style={{ animationDuration: '4s' }}
          >
            {/* Center Vinyl Sticker */}
            <div className="h-8 w-8 rounded-full border-2 border-black flex items-center justify-center bg-[#DEDBC8]">
              <Disc className="w-3 h-3 text-black animate-pulse" />
            </div>
          </div>

          {/* Album Artwork Cover */}
          <div className="relative z-10 h-full w-full overflow-hidden rounded-xl bg-black">
            <img
              src={track.artwork}
              alt={track.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* AI Match Badge */}
            {recommendation && (
              <div className="absolute top-2.5 left-2.5 z-20">
                <MatchScore score={recommendation.matchPercentage} size="sm" />
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavClick}
              className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isFav
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-black/60 text-[#E1E0CC] opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white'
              }`}
              title={isFav ? "Unlike track" : "Like track"}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>

            {/* Hover Play Button Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={handlePlayClick}
                className="btn-primary-circle h-12 w-12 text-black shadow-xl"
                title={isCurrentTrack && isPlaying ? "Pause" : "Play"}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="mt-3 flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#E1E0CC] truncate group-hover:text-[#DEDBC8] transition-colors leading-tight">
              {track.title}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">{track.artist}</p>
          </div>

          {/* Action Bar */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-[#DEDBC8] border border-white/10">
              {track.genre[0]}
            </span>

            <div className="flex items-center gap-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaylistMenu(!showPlaylistMenu);
                }}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Add to playlist"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleDetailClick}
                className="p-1.5 text-gray-400 hover:text-[#DEDBC8] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Why Moodify picked this"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Playlist Dropdown */}
              {showPlaylistMenu && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl glass-panel border border-white/15 p-2 shadow-2xl z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[11px] font-bold text-gray-400 px-2 py-1 border-b border-white/10 uppercase tracking-wider">
                    Add to Playlist
                  </div>
                  <div className="max-h-36 overflow-y-auto mt-1 no-scrollbar">
                    {playlists.map((pl) => (
                      <button
                        key={pl.id}
                        onClick={() => {
                          addTrackToPlaylist(pl.id, track);
                          setShowPlaylistMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-[#E1E0CC] hover:bg-[#DEDBC8]/20 hover:text-[#DEDBC8] rounded-xl truncate transition-colors cursor-pointer"
                      >
                        {pl.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

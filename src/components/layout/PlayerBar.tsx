import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Info, Activity } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { useUserStore } from '../../store/useUserStore';
import { AudioVisualizer } from '../visualizer/AudioVisualizer';

export const PlayerBar: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, playNextTrack, playPrevTrack, volume, setVolume, openTrackModal } =
    useMusicStore();
  const { isFavorite, toggleFavorite } = useUserStore();

  const [showVisualizer, setShowVisualizer] = useState(false);

  if (!currentTrack) return null;

  const isFav = isFavorite(currentTrack.id);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t border-white/10 bg-[#0a0a0d]/95 px-4 md:px-8 flex items-center justify-between gap-4 backdrop-blur-2xl text-[#E1E0CC]">
      {/* Left: Current Track Details */}
      <div className="flex items-center gap-3 min-w-0 w-1/3 md:w-1/4">
        <div
          onClick={() => openTrackModal(currentTrack)}
          className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group border border-white/15 shadow-md"
        >
          <img src={currentTrack.artwork} alt={currentTrack.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Info className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="min-w-0">
          <h4
            onClick={() => openTrackModal(currentTrack)}
            className="text-xs font-bold text-[#E1E0CC] truncate hover:text-[#DEDBC8] cursor-pointer transition-colors"
          >
            {currentTrack.title}
          </h4>
          <p className="text-[11px] text-gray-400 truncate mt-0.5">{currentTrack.artist}</p>
        </div>

        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isFav ? 'text-rose-500 bg-rose-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center: Playback Controls & Waveform */}
      <div className="flex flex-col items-center gap-1.5 max-w-md w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={playPrevTrack}
            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="btn-primary-circle h-10 w-10 shadow-lg shadow-[#DEDBC8]/20"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={playNextTrack}
            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showVisualizer
                ? 'bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/40 shadow-sm'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Web Audio Visualizer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Visualizer</span>
          </button>
        </div>

        {/* Visualizer Popover or Progress Wave */}
        {showVisualizer ? (
          <div className="w-full flex items-center justify-center bg-black/80 rounded-lg p-1 border border-white/10">
            <AudioVisualizer width={280} height={18} barColor="#DEDBC8" />
          </div>
        ) : (
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-gray-400">
            <span>0:15</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full w-1/3 rounded-full bg-[#DEDBC8] group-hover:bg-white transition-colors" />
            </div>
            <span>3:45</span>
          </div>
        )}
      </div>

      {/* Right: Volume & Audio Details */}
      <div className="flex items-center justify-end gap-3 w-1/3 md:w-1/4">
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#DEDBC8] h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};

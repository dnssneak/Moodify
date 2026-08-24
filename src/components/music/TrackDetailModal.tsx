import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Heart, Sparkles, Music2, Activity, Box } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { useUserStore } from '../../store/useUserStore';
import { AudioVisualizer } from '../visualizer/AudioVisualizer';
import { AudioVisualizer3D } from '../visualizer/AudioVisualizer3D';
import { RecommendationService } from '../../services/recommendationService';
import { MatchScore } from './MatchScore';

export const TrackDetailModal: React.FC = () => {
  const { activeTrackForModal, activeRecommendationForModal, closeTrackModal, currentTrack, isPlaying, playTrack, pauseTrack } =
    useMusicStore();
  const { isFavorite, toggleFavorite, preferences } = useUserStore();

  const [use3DVisualizer, setUse3DVisualizer] = useState(true);

  if (!activeTrackForModal) return null;

  const track = activeTrackForModal;
  const isCurrentTrack = currentTrack?.id === track.id;
  const isFav = isFavorite(track.id);

  const rec =
    activeRecommendationForModal || RecommendationService.calculateTrackScore(track, undefined, undefined, preferences);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={closeTrackModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl bg-[#101010] text-[#E1E0CC] max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={closeTrackModal}
            className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Artwork & 3D WebGL Stage */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img src={track.artwork} alt={track.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <MatchScore score={rec.matchPercentage} size="lg" />
                  <button
                    onClick={() => toggleFavorite(track.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                      isFav ? 'bg-rose-500 text-white' : 'bg-black/60 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Playback Button */}
              <button
                onClick={() => (isCurrentTrack && isPlaying ? pauseTrack() : playTrack(track))}
                className="btn-primary w-full mt-4 py-3 font-bold text-xs shadow-lg"
              >
                {isCurrentTrack && isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" /> Pause Preview
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current ml-0.5" /> Play Web Audio Synth
                  </>
                )}
              </button>

              {/* 3D / 2D Visualizer Mode Switcher */}
              <div className="w-full mt-3 flex flex-col items-center bg-black/60 p-2.5 rounded-xl border border-white/10">
                <div className="w-full flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-2 px-1">
                  <span className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5 text-[#DEDBC8]" /> Visualizer Engine:
                  </span>
                  <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-white/5">
                    <button
                      onClick={() => setUse3DVisualizer(true)}
                      className={`px-2 py-0.5 rounded-md text-[10px] transition-all cursor-pointer ${
                        use3DVisualizer ? 'bg-[#DEDBC8] text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      3D WebGL
                    </button>
                    <button
                      onClick={() => setUse3DVisualizer(false)}
                      className={`px-2 py-0.5 rounded-md text-[10px] transition-all cursor-pointer ${
                        !use3DVisualizer ? 'bg-[#DEDBC8] text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      2D Bars
                    </button>
                  </div>
                </div>

                {use3DVisualizer ? (
                  <AudioVisualizer3D color="#DEDBC8" height={150} />
                ) : (
                  <AudioVisualizer width={260} height={45} barColor="#DEDBC8" />
                )}
              </div>
            </div>

            {/* Right Column: Track Details & AI Reasoning */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-[#DEDBC8] border border-white/10">
                    {track.genre[0]}
                  </span>
                  <span className="text-xs text-gray-400">Released {track.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#E1E0CC] mt-1.5">{track.title}</h2>
                <p className="text-sm font-medium text-[#DEDBC8] italic font-serif">{track.artist}</p>
                <p className="text-xs text-gray-400 mt-0.5">Album: {track.album}</p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                {track.description}
              </p>

              {/* Sonic Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3 text-[#DEDBC8]" /> Energy
                  </div>
                  <div className="text-sm font-bold text-[#DEDBC8] mt-0.5">{track.energy}%</div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <Music2 className="w-3 h-3 text-[#DEDBC8]" /> Tempo
                  </div>
                  <div className="text-sm font-bold text-[#DEDBC8] mt-0.5">{track.tempo} BPM</div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 text-center">
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#DEDBC8]" /> Moods
                  </div>
                  <div className="text-xs font-bold text-[#DEDBC8] truncate mt-0.5">
                    {track.moods.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>

              {/* Explainable AI Section */}
              <div className="rounded-2xl bg-black/60 p-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DEDBC8] uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-4 h-4 text-[#DEDBC8] animate-pulse" />
                  Why Moodify Picked This
                </div>
                <ul className="space-y-1.5">
                  {rec.reasons.map((reason, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-[#DEDBC8] mt-0.5">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

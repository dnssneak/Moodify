import { create } from 'zustand';
import type { Track, AIRecommendation } from '../types/music';
import { MOCK_TRACKS } from '../data/tracks';
import { audioService } from '../services/audioService';

interface MusicState {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  currentTime: number;
  duration: number;
  selectedMood: string | null;
  searchQuery: string;
  recommendations: { track: Track; recommendation: AIRecommendation }[];
  activeTrackForModal: Track | null;
  activeRecommendationForModal: AIRecommendation | null;

  // Actions
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setSelectedMood: (mood: string | null) => void;
  setSearchQuery: (query: string) => void;
  setRecommendations: (recs: { track: Track; recommendation: AIRecommendation }[]) => void;
  openTrackModal: (track: Track, recommendation?: AIRecommendation) => void;
  closeTrackModal: () => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: MOCK_TRACKS,
  currentTrack: MOCK_TRACKS[0],
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: MOCK_TRACKS[0].duration,
  selectedMood: null,
  searchQuery: '',
  recommendations: [],
  activeTrackForModal: null,
  activeRecommendationForModal: null,

  playTrack: (track: Track) => {
    audioService.playTrack(track, get().volume);
    set({ currentTrack: track, isPlaying: true, duration: track.duration, currentTime: 0 });
  },

  pauseTrack: () => {
    audioService.stop();
    set({ isPlaying: false });
  },

  togglePlay: () => {
    const { isPlaying, currentTrack, playTrack, pauseTrack } = get();
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else {
      playTrack(MOCK_TRACKS[0]);
    }
  },

  setVolume: (volume: number) => {
    audioService.setVolume(volume);
    set({ volume });
  },

  setSelectedMood: (mood: string | null) => {
    set({ selectedMood: mood });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setRecommendations: (recs) => {
    set({ recommendations: recs });
  },

  openTrackModal: (track, recommendation) => {
    set({ activeTrackForModal: track, activeRecommendationForModal: recommendation || null });
  },

  closeTrackModal: () => {
    set({ activeTrackForModal: null, activeRecommendationForModal: null });
  },

  playNextTrack: () => {
    const { tracks, currentTrack, playTrack } = get();
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    playTrack(nextTrack);
  },

  playPrevTrack: () => {
    const { tracks, currentTrack, playTrack } = get();
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    playTrack(prevTrack);
  },
}));

import { create } from 'zustand';
import type { Playlist, Track } from '../types/music';
import { MOCK_TRACKS } from '../data/tracks';

const LOCAL_STORAGE_KEY_PLAYLISTS = 'moodify_playlists';

const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Chill & Study Focus',
    description: 'Minimalist ambient soundscapes and soft lofi beats crafted for deep focus and study flow.',
    artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    mood: 'focused',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[3], MOCK_TRACKS[5], MOCK_TRACKS[9]],
    generatedByAI: true,
    createdAt: 'Aug 20, 2024',
    gradient: 'from-blue-900 via-indigo-900 to-black',
  },
  {
    id: 'playlist-2',
    name: 'Neon Night Driving',
    description: 'High energy 80s synthwave arpeggios and dark electronic basslines.',
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    mood: 'dreamy',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[2], MOCK_TRACKS[7], MOCK_TRACKS[11]],
    generatedByAI: false,
    createdAt: 'Aug 22, 2024',
    gradient: 'from-purple-900 via-pink-900 to-black',
  },
];

function getStoredPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PLAYLISTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_PLAYLISTS;
}

interface PlaylistState {
  playlists: Playlist[];
  activePlaylist: Playlist | null;

  // Actions
  createPlaylist: (name: string, description: string, mood?: string) => Playlist;
  saveAIPlaylist: (playlist: Playlist) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  setActivePlaylist: (playlist: Playlist | null) => void;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: getStoredPlaylists(),
  activePlaylist: null,

  createPlaylist: (name: string, description: string, mood: string = 'chill') => {
    const newPlaylist: Playlist = {
      id: `custom-playlist-${Date.now()}`,
      name: name.trim() || 'My Custom Playlist',
      description: description.trim() || 'A personalized collection of tracks.',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      mood,
      tracks: [],
      generatedByAI: false,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      gradient: 'from-emerald-900 via-teal-900 to-black',
    };

    const updated = [newPlaylist, ...get().playlists];
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    set({ playlists: updated, activePlaylist: newPlaylist });
    return newPlaylist;
  },

  saveAIPlaylist: (playlist: Playlist) => {
    const { playlists } = get();
    const exists = playlists.some((p) => p.id === playlist.id);
    if (exists) return;
    const updated = [playlist, ...playlists];
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    set({ playlists: updated });
  },

  deletePlaylist: (playlistId: string) => {
    const updated = get().playlists.filter((p) => p.id !== playlistId);
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    set({
      playlists: updated,
      activePlaylist: get().activePlaylist?.id === playlistId ? null : get().activePlaylist,
    });
  },

  addTrackToPlaylist: (playlistId: string, track: Track) => {
    const updated = get().playlists.map((pl) => {
      if (pl.id === playlistId) {
        if (pl.tracks.some((t) => t.id === track.id)) return pl;
        return { ...pl, tracks: [...pl.tracks, track] };
      }
      return pl;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    set({ playlists: updated });
  },

  removeTrackFromPlaylist: (playlistId: string, trackId: string) => {
    const updated = get().playlists.map((pl) => {
      if (pl.id === playlistId) {
        return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
      }
      return pl;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    set({ playlists: updated });
  },

  setActivePlaylist: (playlist) => {
    set({ activePlaylist: playlist });
  },
}));

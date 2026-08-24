import { create } from 'zustand';
import type { UserPreferences, Track } from '../types/music';

const LOCAL_STORAGE_KEY_FAVORITES = 'moodify_favorites';
const LOCAL_STORAGE_KEY_PREFS = 'moodify_user_preferences';
const LOCAL_STORAGE_KEY_RECENT = 'moodify_recent_tracks';

function getStoredArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredPrefs(): UserPreferences {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    favoriteGenres: ['Synthwave', 'Ambient', 'Lofi Beat'],
    preferredMoods: ['calm', 'focused', 'dreamy'],
    energyPreference: 50,
    recommendationDiversity: 'balanced',
    visualizerMode: 'bars',
  };
}

interface UserState {
  favorites: string[]; // Track IDs
  recentlyPlayed: string[]; // Track IDs
  recentSearches: string[];
  preferences: UserPreferences;

  // Actions
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  addRecentlyPlayed: (track: Track) => void;
  addRecentSearch: (query: string) => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  favorites: getStoredArray(LOCAL_STORAGE_KEY_FAVORITES),
  recentlyPlayed: getStoredArray(LOCAL_STORAGE_KEY_RECENT),
  recentSearches: ['lofi ambient beats for rainy day', 'cyberpunk workout energy', 'chill synthwave'],
  preferences: getStoredPrefs(),

  toggleFavorite: (trackId: string) => {
    const { favorites } = get();
    const isFav = favorites.includes(trackId);
    const updated = isFav ? favorites.filter((id) => id !== trackId) : [...favorites, trackId];
    localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    set({ favorites: updated });
  },

  isFavorite: (trackId: string) => {
    return get().favorites.includes(trackId);
  },

  addRecentlyPlayed: (track: Track) => {
    const { recentlyPlayed } = get();
    const filtered = recentlyPlayed.filter((id) => id !== track.id);
    const updated = [track.id, ...filtered].slice(0, 20);
    localStorage.setItem(LOCAL_STORAGE_KEY_RECENT, JSON.stringify(updated));
    set({ recentlyPlayed: updated });
  },

  addRecentSearch: (query: string) => {
    if (!query.trim()) return;
    const { recentSearches } = get();
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
    set({ recentSearches: [query, ...filtered].slice(0, 10) });
  },

  updatePreferences: (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...get().preferences, ...newPrefs };
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFS, JSON.stringify(updated));
    set({ preferences: updated });
  },

  clearUserData: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_FAVORITES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_RECENT);
    set({
      favorites: [],
      recentlyPlayed: [],
      recentSearches: [],
      preferences: getStoredPrefs(),
    });
  },
}));

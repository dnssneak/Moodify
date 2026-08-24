export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  artwork: string;
  genre: string[];
  moods: string[];
  energy: number; // 1 - 100
  tempo: number; // BPM
  year: number;
  duration: number; // in seconds
  description: string;
  synthPreset: {
    baseFreq: number;
    waveType: OscillatorType;
    detune?: number;
    tempoBpm: number;
    color: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genres: string[];
  bio: string;
  popularTracks: string[]; // Track IDs
  similarArtists: string[]; // Artist names/IDs
  aiInsight: string;
}

export interface AIRecommendation {
  trackId: string;
  matchPercentage: number;
  reasons: string[];
  moodMatch: string;
  contextMatch: string;
  energyMatch: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  artwork: string;
  mood: string;
  tracks: Track[];
  generatedByAI: boolean;
  createdAt: string;
  gradient?: string;
}

export interface UserPreferences {
  favoriteGenres: string[];
  preferredMoods: string[];
  energyPreference: number; // 1-100
  aiProviderKey?: string;
  recommendationDiversity: 'focused' | 'balanced' | 'exploratory';
  visualizerMode: 'bars' | 'circular' | 'particles';
}

export interface NaturalLanguageIntent {
  rawQuery: string;
  extractedMoods: string[];
  extractedGenres: string[];
  targetEnergy?: number;
  activityContext?: string;
  timeOfDay?: string;
}

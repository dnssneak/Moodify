export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  genre: string[];
  moods: string[];
  energy: number; // 0 - 100
  tempo: number;  // BPM
  year: number;
  durationSeconds: number;
  aiExplanation?: string;
}

export interface MatchScore {
  overall: number;       // 0 - 100
  moodScore: number;     // 0 - 100
  genreScore: number;    // 0 - 100
  energyScore: number;   // 0 - 100
  contextScore: number;  // 0 - 100
  reasons: string[];
}

export interface TrackRecommendation {
  track: Track;
  matchScore: MatchScore;
}

export type AIStreamStatus = 'idle' | 'loading' | 'streaming' | 'success' | 'error';

export type ErrorErrorCode = 
  | 'NETWORK_ERROR' 
  | 'STREAM_INTERRUPTED' 
  | 'RATE_LIMIT_429' 
  | 'EMPTY_INPUT' 
  | 'ZERO_RESULTS' 
  | 'ROUTE_ERROR';

export interface AIServiceError {
  code: ErrorErrorCode;
  message: string;
  details?: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  timestamp: number;
}

export interface SabotageConfig {
  forceNetworkError: boolean;
  interruptStream: boolean;
  forceRateLimit: boolean;
  slowResponse: boolean;
  forceZeroResults: boolean;
  throwBoundaryError: boolean;
}

export interface MoodCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface ActivityCategory {
  id: string;
  label: string;
  icon: string;
}

export interface AIResponseData {
  extractedIntent: {
    mood: string;
    energy: number;
    activity: string;
    genres: string[];
  };
  summary: string;
  recommendations: TrackRecommendation[];
  isFallback: boolean;
  interruptedText?: string;
}

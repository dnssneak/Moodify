import { useState, useCallback, useRef } from 'react';
import type {
  AIStreamStatus,
  AIServiceError,
  AIResponseData,
  SabotageConfig,
  TrackRecommendation,
  MatchScore,
} from '../types';
import { MOCK_TRACKS, MOCK_MOODS } from '../data/mockDataset';

const DEFAULT_SABOTAGE: SabotageConfig = {
  forceNetworkError: false,
  interruptStream: false,
  forceRateLimit: false,
  slowResponse: false,
  forceZeroResults: false,
  throwBoundaryError: false,
};

export function useAIMoodChat() {
  const [status, setStatus] = useState<AIStreamStatus>('idle');
  const [streamedText, setStreamedText] = useState<string>('');
  const [responseData, setResponseData] = useState<AIResponseData | null>(null);
  const [error, setError] = useState<AIServiceError | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [sabotageConfig, setSabotageConfig] = useState<SabotageConfig>(DEFAULT_SABOTAGE);

  // Store last inputs for retry execution
  const lastInputRef = useRef<{ prompt: string; moodId: string | null; activityId: string | null }>({
    prompt: '',
    moodId: null,
    activityId: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Local matching algorithm calculation
  const calculateMatch = (
    trackMoods: string[],
    trackEnergy: number,
    targetMood: string | null,
    userQuery: string
  ): MatchScore => {
    let moodScore = 70;
    let energyScore = 75;
    let genreScore = 80;
    let contextScore = 85;

    const lowerQuery = userQuery.toLowerCase();

    if (targetMood) {
      if (trackMoods.includes(targetMood.toLowerCase())) {
        moodScore = 95;
      } else {
        moodScore = 60;
      }
    } else if (userQuery) {
      const matched = trackMoods.some((m) => lowerQuery.includes(m.toLowerCase()));
      moodScore = matched ? 92 : 68;
    }

    if (lowerQuery.includes('calm') || lowerQuery.includes('relax') || lowerQuery.includes('sleep')) {
      energyScore = Math.max(30, 100 - trackEnergy);
    } else if (lowerQuery.includes('energetic') || lowerQuery.includes('workout') || lowerQuery.includes('dance')) {
      energyScore = Math.min(100, trackEnergy + 10);
    }

    const overall = Math.round(
      moodScore * 0.35 + genreScore * 0.25 + energyScore * 0.2 + contextScore * 0.2
    );

    const reasons: string[] = [];
    if (moodScore >= 90) reasons.push(`Strongly aligns with your ${targetMood || 'desired'} mood profile`);
    if (energyScore >= 80) reasons.push(`Energy level (${trackEnergy}%) matches your activity intensity`);
    reasons.push(`Genre blend pairs well with current listening context`);

    return {
      overall,
      moodScore,
      genreScore,
      energyScore,
      contextScore,
      reasons,
    };
  };

  const generateRecommendations = useCallback(
    async (prompt: string, moodId: string | null = null, activityId: string | null = null) => {
      // Abort any ongoing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Store inputs for retry
      lastInputRef.current = { prompt, moodId, activityId };

      const trimmedPrompt = prompt.trim();
      const moodObj = MOCK_MOODS.find((m) => m.id === moodId);

      // Edge Case 1: Empty Input
      if (!trimmedPrompt && !moodId && !activityId) {
        setError({
          code: 'EMPTY_INPUT',
          message: 'Prompt is empty',
          details: 'Please type a message describing your desired vibe or select a mood chip to generate recommendations.',
          retryable: false,
          timestamp: Date.now(),
        });
        setStatus('error');
        return;
      }

      // Reset state for new request
      setError(null);
      setResponseData(null);
      setStreamedText('');
      setStatus('loading');

      // Latency simulation (normal 800ms vs slow 3500ms)
      const delayMs = sabotageConfig.slowResponse ? 3500 : 800;
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      // Edge Case 2: Sabotage Network Error
      if (sabotageConfig.forceNetworkError) {
        setError({
          code: 'NETWORK_ERROR',
          message: 'Network Request Failed (TypeError: Failed to fetch)',
          details: 'Unable to establish WebSocket / HTTP connection to Moodify AI server. Please check your internet connection.',
          retryable: true,
          timestamp: Date.now(),
        });
        setStatus('error');
        return;
      }

      // Edge Case 3: Sabotage Rate Limit 429
      if (sabotageConfig.forceRateLimit) {
        setError({
          code: 'RATE_LIMIT_429',
          message: 'HTTP 429: Too Many Requests (Rate Limit Exceeded)',
          details: 'AI request limit reached for free tier model. Please wait before retrying or fallback to local matching engine.',
          retryable: true,
          retryAfterSeconds: 10,
          timestamp: Date.now(),
        });
        setStatus('error');
        return;
      }

      // Edge Case 4: Sabotage Force Zero Results
      if (sabotageConfig.forceZeroResults) {
        setResponseData({
          extractedIntent: {
            mood: moodObj?.label || 'Custom',
            energy: 50,
            activity: activityId || 'Unknown',
            genres: ['None'],
          },
          summary: `Searched mock database for "${trimmedPrompt || moodObj?.label}". 0 matching tracks found for this specific filter set.`,
          recommendations: [],
          isFallback: false,
        });
        setStatus('success');
        return;
      }

      // Happy Path & Streaming simulation
      setStatus('streaming');

      const streamChunks = [
        `Analyzing intent for "${trimmedPrompt || moodObj?.label || 'Discovery'}"...\n`,
        `Extracting energy spectrum and tempo preferences...\n`,
        `Searching database of 15+ curated audio tracks...\n`,
        `Generating AI match explanations and audio scoring...\n`,
      ];

      let builtText = '';

      for (let i = 0; i < streamChunks.length; i++) {
        // Edge Case 5: Sabotage Mid-Stream Interruption
        if (sabotageConfig.interruptStream && i === 2) {
          builtText += streamChunks[i];
          setStreamedText(builtText);

          setError({
            code: 'STREAM_INTERRUPTED',
            message: 'AI Stream Connection Interrupted',
            details: 'The streaming response connection dropped mid-sentence while synthesizing track match scores.',
            retryable: true,
            timestamp: Date.now(),
          });
          setStatus('error');
          return;
        }

        builtText += streamChunks[i];
        setStreamedText(builtText);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      // Filter and score candidate tracks
      let filteredTracks = MOCK_TRACKS;

      if (moodId) {
        filteredTracks = filteredTracks.filter((t) => t.moods.includes(moodId));
        if (filteredTracks.length === 0) filteredTracks = MOCK_TRACKS;
      }

      const recs: TrackRecommendation[] = filteredTracks.map((track) => {
        const matchScore = calculateMatch(track.moods, track.energy, moodId, trimmedPrompt);
        return {
          track,
          matchScore,
        };
      });

      // Sort by match score descending
      recs.sort((a, b) => b.matchScore.overall - a.matchScore.overall);

      setResponseData({
        extractedIntent: {
          mood: moodObj?.label || 'Curated',
          energy: 65,
          activity: activityId || 'General Listening',
          genres: ['Ambient', 'Indie', 'Synthwave'],
        },
        summary: `Found ${recs.length} recommendations tailored for your ${moodObj?.label || 'requested'} vibe.`,
        recommendations: recs,
        isFallback: false,
      });

      setStatus('success');
    },
    [sabotageConfig]
  );

  // Native Retry action for AI failure handling
  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    const { prompt, moodId, activityId } = lastInputRef.current;
    generateRecommendations(prompt, moodId, activityId);
  }, [generateRecommendations]);

  // Local fallback engine action
  const fallbackToLocalMatching = useCallback(() => {
    setError(null);
    const recs: TrackRecommendation[] = MOCK_TRACKS.map((track) => ({
      track,
      matchScore: {
        overall: 85,
        moodScore: 80,
        genreScore: 85,
        energyScore: 90,
        contextScore: 85,
        reasons: ['Local Fallback Recommendation Engine matched track attributes directly.'],
      },
    }));

    setResponseData({
      extractedIntent: {
        mood: 'Local Fallback',
        energy: 50,
        activity: 'Offline Matching',
        genres: ['All'],
      },
      summary: 'Generated recommendations via client-side deterministic fallback algorithm.',
      recommendations: recs,
      isFallback: true,
    });
    setStatus('success');
  }, []);

  const resetAllState = useCallback(() => {
    setStatus('idle');
    setStreamedText('');
    setResponseData(null);
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    status,
    streamedText,
    responseData,
    error,
    retryCount,
    sabotageConfig,
    setSabotageConfig,
    generateRecommendations,
    retry,
    fallbackToLocalMatching,
    resetAllState,
  };
}

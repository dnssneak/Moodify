import type { Track, AIRecommendation, NaturalLanguageIntent, UserPreferences } from '../types/music';
import { MOCK_TRACKS } from '../data/tracks';

export class RecommendationService {
  /**
   * Parse natural language input into structured intent (local regex engine fallback)
   */
  static parseIntentLocally(query: string): NaturalLanguageIntent {
    const q = query.toLowerCase();
    const extractedMoods: string[] = [];
    const extractedGenres: string[] = [];
    let targetEnergy = 50;

    // Mood keywords
    if (q.includes('calm') || q.includes('relax') || q.includes('peaceful') || q.includes('sleep') || q.includes('rest')) {
      extractedMoods.push('calm');
      targetEnergy = 25;
    }
    if (q.includes('study') || q.includes('focus') || q.includes('code') || q.includes('work') || q.includes('reading')) {
      extractedMoods.push('focused');
      targetEnergy = 45;
    }
    if (q.includes('gym') || q.includes('workout') || q.includes('energetic') || q.includes('run') || q.includes('intense')) {
      extractedMoods.push('energetic', 'motivated');
      targetEnergy = 90;
    }
    if (q.includes('dream') || q.includes('floating') || q.includes('ethereal') || q.includes('night')) {
      extractedMoods.push('dreamy');
    }
    if (q.includes('retro') || q.includes('80s') || q.includes('90s') || q.includes('nostalgia') || q.includes('memory')) {
      extractedMoods.push('nostalgic');
    }
    if (q.includes('sad') || q.includes('rain') || q.includes('lonely') || q.includes('crying')) {
      extractedMoods.push('melancholic', 'sad');
      targetEnergy = 20;
    }
    if (q.includes('happy') || q.includes('upbeat') || q.includes('joy') || q.includes('sunny')) {
      extractedMoods.push('happy');
      targetEnergy = 70;
    }

    // Genre keywords
    if (q.includes('lofi') || q.includes('chillhop') || q.includes('beats')) extractedGenres.push('Lofi Beat');
    if (q.includes('ambient') || q.includes('drone')) extractedGenres.push('Ambient');
    if (q.includes('synth') || q.includes('cyberpunk') || q.includes('synthwave')) extractedGenres.push('Synthwave', 'Electronic');
    if (q.includes('piano') || q.includes('classical') || q.includes('orchestral')) extractedGenres.push('Neo-Classical', 'Orchestral');
    if (q.includes('acoustic') || q.includes('indie')) extractedGenres.push('Indie Chill');

    if (extractedMoods.length === 0) extractedMoods.push('focused');

    return {
      rawQuery: query,
      extractedMoods,
      extractedGenres,
      targetEnergy,
      activityContext: q,
    };
  }

  /**
   * Calculate vector match score for a given track against intent & user preferences
   */
  static calculateTrackScore(
    track: Track,
    intent?: NaturalLanguageIntent,
    selectedMood?: string,
    preferences?: UserPreferences
  ): AIRecommendation {
    let moodScore = 0;
    let genreScore = 0;
    let energyScore = 0;
    let preferenceScore = 0;

    const reasons: string[] = [];

    // 1. Mood Matching (Weight: 35%)
    const targetMoods = intent?.extractedMoods || (selectedMood ? [selectedMood.toLowerCase()] : []);
    if (targetMoods.length > 0) {
      const matchedMoods = track.moods.filter((m) => targetMoods.includes(m.toLowerCase()));
      if (matchedMoods.length > 0) {
        moodScore = 100;
        reasons.push(`✓ Perfectly matches your "${matchedMoods.join(', ')}" mood request`);
      } else {
        moodScore = 40;
      }
    } else {
      moodScore = 70;
    }

    // 2. Genre Matching (Weight: 25%)
    const targetGenres = intent?.extractedGenres || [];
    if (targetGenres.length > 0) {
      const matchedGenres = track.genre.filter((g) =>
        targetGenres.some((tg) => g.toLowerCase().includes(tg.toLowerCase()))
      );
      if (matchedGenres.length > 0) {
        genreScore = 100;
        reasons.push(`✓ Aligning genre: ${matchedGenres.join(', ')}`);
      } else {
        genreScore = 50;
      }
    } else {
      genreScore = 75;
    }

    // 3. Energy Matching (Weight: 20%)
    const targetEnergy = intent?.targetEnergy ?? (preferences?.energyPreference || 50);
    const energyDiff = Math.abs(track.energy - targetEnergy);
    energyScore = Math.max(0, 100 - energyDiff * 1.2);
    if (energyDiff < 20) {
      reasons.push(`✓ Energy level (${track.energy}%) ideal for your context`);
    }

    // 4. Preference Synergy (Weight: 20%)
    if (preferences) {
      if (preferences.favoriteGenres.some((fg) => track.genre.includes(fg))) {
        preferenceScore += 50;
        reasons.push(`✓ Features your preferred genre`);
      }
      if (preferences.preferredMoods.some((pm) => track.moods.includes(pm.toLowerCase()))) {
        preferenceScore += 50;
        reasons.push(`✓ Fits your top listening mood history`);
      }
    } else {
      preferenceScore = 70;
    }

    // Overall weighted score computation
    const totalScore = Math.round(
      moodScore * 0.35 + genreScore * 0.25 + energyScore * 0.2 + preferenceScore * 0.2
    );

    if (reasons.length === 0) {
      reasons.push(`✓ Atmospheric production matches overall discovery vibe`);
    }

    return {
      trackId: track.id,
      matchPercentage: Math.min(99, Math.max(65, totalScore)),
      reasons,
      moodMatch: `${Math.round(moodScore)}%`,
      contextMatch: intent?.activityContext ? 'High synergy' : 'Balanced',
      energyMatch: `${Math.round(energyScore)}%`,
    };
  }

  /**
   * Rank and filter catalog tracks
   */
  static getRecommendations(
    query?: string,
    selectedMood?: string,
    preferences?: UserPreferences
  ): { track: Track; recommendation: AIRecommendation }[] {
    const intent = query ? this.parseIntentLocally(query) : undefined;

    return MOCK_TRACKS.map((track) => ({
      track,
      recommendation: this.calculateTrackScore(track, intent, selectedMood, preferences),
    })).sort((a, b) => b.recommendation.matchPercentage - a.recommendation.matchPercentage);
  }
}

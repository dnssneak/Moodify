import { GoogleGenAI } from '@google/genai';
import type { Track, AIRecommendation, Playlist, UserPreferences } from '../types/music';
import { RecommendationService } from './recommendationService';
import { MOCK_TRACKS } from '../data/tracks';

export class AIService {
  private static getClient(apiKey?: string): GoogleGenAI | null {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) return null;
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch {
      return null;
    }
  }

  /**
   * Natural Language Music Search & Recommendation
   */
  static async recommendForPrompt(
    query: string,
    apiKey?: string,
    preferences?: UserPreferences
  ): Promise<{ track: Track; recommendation: AIRecommendation }[]> {
    const aiClient = this.getClient(apiKey);

    if (!aiClient) {
      // Automatic Local Recommendation Fallback Engine
      return RecommendationService.getRecommendations(query, undefined, preferences);
    }

    try {
      const prompt = `You are Moodify's AI Music Curator.
A user asked: "${query}"

Available Tracks in dataset:
${JSON.stringify(
  MOCK_TRACKS.map((t) => ({ id: t.id, title: t.title, artist: t.artist, genre: t.genre, moods: t.moods, energy: t.energy })),
  null,
  2
)}

Select top 5 tracks that best match the query intent. Return strictly valid JSON array of objects with schema:
[
  {
    "trackId": "string",
    "matchPercentage": number (60-98),
    "reasons": ["string", "string"],
    "moodMatch": "string",
    "contextMatch": "string",
    "energyMatch": "string"
  }
]`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty AI response');

      const parsed: AIRecommendation[] = JSON.parse(responseText);

      const results = parsed
        .map((rec) => {
          const track = MOCK_TRACKS.find((t) => t.id === rec.trackId);
          if (!track) return null;
          return { track, recommendation: rec };
        })
        .filter((item): item is { track: Track; recommendation: AIRecommendation } => item !== null);

      if (results.length === 0) throw new Error('No valid track matches from AI');
      return results;
    } catch (err) {
      console.warn('Gemini API call failed or unavailable, falling back to local AI engine:', err);
      return RecommendationService.getRecommendations(query, undefined, preferences);
    }
  }

  /**
   * AI Playlist Generator
   */
  static async generateAIPlaylist(
    prompt: string,
    trackCount: number = 8,
    apiKey?: string
  ): Promise<Playlist> {
    const aiClient = this.getClient(apiKey);
    const intent = RecommendationService.parseIntentLocally(prompt);

    let playlistName = `${intent.extractedMoods[0] ? intent.extractedMoods[0].toUpperCase() : 'Vibe'} Soundscapes`;
    let playlistDesc = `AI curated collection for "${prompt}"`;
    let selectedTracks: Track[] = [];

    if (aiClient) {
      try {
        const aiPrompt = `Generate an AI Music Playlist for prompt: "${prompt}".
Available Tracks: ${JSON.stringify(MOCK_TRACKS.map((t) => ({ id: t.id, title: t.title, artist: t.artist, moods: t.moods })))}
Return JSON:
{
  "name": "Creative Playlist Title",
  "description": "Evocative 1-sentence description",
  "mood": "dominant mood",
  "trackIds": ["track-1", "track-2"]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: aiPrompt,
          config: { responseMimeType: 'application/json' },
        });

        const data = JSON.parse(response.text || '{}');
        if (data.name) playlistName = data.name;
        if (data.description) playlistDesc = data.description;
        if (Array.isArray(data.trackIds)) {
          selectedTracks = data.trackIds
            .map((id: string) => MOCK_TRACKS.find((t) => t.id === id))
            .filter((t: Track | undefined): t is Track => t !== undefined);
        }
      } catch (e) {
        console.warn('AI Playlist generation falling back to local matcher:', e);
      }
    }

    if (selectedTracks.length === 0) {
      const recs = RecommendationService.getRecommendations(prompt);
      selectedTracks = recs.slice(0, trackCount).map((r) => r.track);
    }

    return {
      id: `ai-playlist-${Date.now()}`,
      name: playlistName,
      description: playlistDesc,
      artwork: selectedTracks[0]?.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      mood: intent.extractedMoods[0] || 'Chill',
      tracks: selectedTracks,
      generatedByAI: true,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      gradient: 'from-purple-900 via-indigo-900 to-black',
    };
  }
}

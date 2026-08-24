import { GoogleGenAI } from '@google/genai';
import type { Track, AIRecommendation, Playlist, UserPreferences } from '../types/music';
import { RecommendationService } from './recommendationService';
import { MOCK_TRACKS } from '../data/tracks';

export class AIService {
  private static getClient(apiKey?: string): GoogleGenAI | null {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') return null;
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }

  /**
   * Helper to clean Markdown code block wrappers from Gemini JSON responses
   */
  private static cleanJsonResponse(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }
    return clean;
  }

  /**
   * Sequentially attempts candidate models until one succeeds
   */
  private static async generateContentWithFallback(
    aiClient: GoogleGenAI,
    prompt: string
  ): Promise<string> {
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-pro',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
    ];

    let lastError: unknown = null;
    for (const model of candidateModels) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        if (response.text) {
          console.log(`✨ Successfully connected to Gemini API using model: ${model}`);
          return response.text;
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`Model candidate '${model}' unavailable (${msg}), attempting next candidate...`);
      }
    }

    throw lastError || new Error('All candidate Gemini models failed.');
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

      const responseText = await this.generateContentWithFallback(aiClient, prompt);
      if (!responseText) throw new Error('Empty AI response from Gemini');

      const cleanJson = this.cleanJsonResponse(responseText);
      const parsed: AIRecommendation[] = JSON.parse(cleanJson);

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
      console.warn('Gemini API call failed, falling back to local AI engine:', err);
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

        const responseText = await this.generateContentWithFallback(aiClient, aiPrompt);
        const cleanJson = this.cleanJsonResponse(responseText || '{}');
        const data = JSON.parse(cleanJson);
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

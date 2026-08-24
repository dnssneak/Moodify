import { create } from 'zustand';
import type { Playlist } from '../types/music';
import { AIService } from '../services/aiService';

interface AIState {
  isGenerating: boolean;
  generationStep: string;
  prompt: string;
  error: string | null;
  lastGeneratedPlaylist: Playlist | null;

  // Actions
  setPrompt: (prompt: string) => void;
  generatePlaylist: (promptText: string, trackCount?: number, apiKey?: string) => Promise<Playlist | null>;
  resetAIState: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isGenerating: false,
  generationStep: '',
  prompt: '',
  error: null,
  lastGeneratedPlaylist: null,

  setPrompt: (prompt: string) => {
    set({ prompt });
  },

  generatePlaylist: async (promptText: string, trackCount: number = 8, apiKey?: string) => {
    set({ isGenerating: true, error: null, prompt: promptText, generationStep: 'Analyzing mood & intent...' });

    try {
      await new Promise((r) => setTimeout(r, 600));
      set({ generationStep: 'Extracting sonic characteristics & energy...' });

      await new Promise((r) => setTimeout(r, 600));
      set({ generationStep: 'Calculating vector match scores...' });

      const playlist = await AIService.generateAIPlaylist(promptText, trackCount, apiKey);

      set({
        isGenerating: false,
        generationStep: '',
        lastGeneratedPlaylist: playlist,
      });

      return playlist;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'AI generation failed';
      set({
        isGenerating: false,
        generationStep: '',
        error: errorMessage,
      });
      return null;
    }
  },

  resetAIState: () => {
    set({ isGenerating: false, generationStep: '', error: null });
  },
}));

import React, { useState } from 'react';
import { Sparkles, Save, CheckCircle2, Music2 } from 'lucide-react';
import { useAIStore } from '../store/useAIStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useMusicStore } from '../store/useMusicStore';
import { useUserStore } from '../store/useUserStore';
import { AIThinking } from '../components/ai/AIThinking';
import { MatchScore } from '../components/music/MatchScore';

export const AIPlaylistGeneratorPage: React.FC = () => {
  const { isGenerating, generationStep, generatePlaylist, lastGeneratedPlaylist } = useAIStore();
  const { saveAIPlaylist } = usePlaylistStore();
  const { playTrack } = useMusicStore();
  const { preferences } = useUserStore();

  const [prompt, setPrompt] = useState('Create a 10-track playlist for late-night focus and coding');
  const [trackCount, setTrackCount] = useState<number>(8);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSaved(false);
    await generatePlaylist(prompt, trackCount, preferences.aiProviderKey);
  };

  const handleSaveToLibrary = () => {
    if (lastGeneratedPlaylist) {
      saveAIPlaylist(lastGeneratedPlaylist);
      setSaved(true);
    }
  };

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 pb-32 text-[#E1E0CC]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#DEDBC8] border border-white/10 text-xs font-semibold w-fit">
          <Sparkles className="w-4 h-4 text-[#DEDBC8] animate-pulse" />
          <span>Generative AI Curator</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC]">AI Playlist Generator</h1>
        <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
          Describe the exact theme, mood, or activity you want. Our AI will select tracks, write custom descriptions, and build your playlist.
        </p>
      </div>

      {/* Generator Form */}
      <section className="p-6 md:p-8 rounded-3xl border border-white/15 glass-panel shadow-2xl">
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Playlist Prompt / Context:</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "Create a high energy 80s synthwave playlist for gym workouts"'
              className="w-full px-4 py-3 text-sm rounded-2xl glass-input border border-white/15 text-[#E1E0CC] placeholder-gray-400 focus:outline-none focus:border-[#DEDBC8]"
              disabled={isGenerating}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 mr-1">Track Count:</span>
              {[6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTrackCount(num)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    trackCount === num
                      ? 'bg-[#DEDBC8] text-black font-bold shadow-md'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {num} tracks
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary py-3 px-6 shadow-xl"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Generate AI Playlist</span>
            </button>
          </div>
        </form>
      </section>

      {/* Loading Indicator */}
      {isGenerating && <AIThinking step={generationStep} />}

      {/* Generated Playlist Preview */}
      {lastGeneratedPlaylist && !isGenerating && (
        <section className="flex flex-col gap-6">
          {/* Playlist Cover Header */}
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 glass-panel flex flex-col md:flex-row items-center gap-6 shadow-2xl">
            <img
              src={lastGeneratedPlaylist.artwork}
              alt={lastGeneratedPlaylist.name}
              className="h-36 w-36 rounded-2xl object-cover shadow-2xl border border-white/15"
            />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DEDBC8]/20 text-[#DEDBC8] border border-[#DEDBC8]/30">
                  AI Generated
                </span>
                <span className="text-xs text-gray-400">{lastGeneratedPlaylist.tracks.length} Tracks</span>
              </div>
              <h2 className="text-2xl font-bold text-[#E1E0CC]">{lastGeneratedPlaylist.name}</h2>
              <p className="text-xs text-gray-300 leading-relaxed">{lastGeneratedPlaylist.description}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => playTrack(lastGeneratedPlaylist.tracks[0])}
                  className="btn-primary py-2 px-5 text-xs"
                >
                  <Music2 className="w-4 h-4" /> Play All
                </button>

                <button
                  onClick={handleSaveToLibrary}
                  disabled={saved}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    saved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                      : 'bg-black text-gray-200 hover:bg-zinc-900 border-white/10'
                  }`}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved to Library
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Playlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tracklist Table */}
          <div className="p-4 rounded-2xl border border-white/5 bg-[#212121] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-3">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Artist</th>
                  <th className="pb-3">Genre</th>
                  <th className="pb-3 text-right pr-3">AI Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lastGeneratedPlaylist.tracks.map((track, index) => (
                  <tr
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 pl-3 text-gray-400 font-bold">{index + 1}</td>
                    <td className="py-3 flex items-center gap-3">
                      <img src={track.artwork} alt={track.title} className="h-9 w-9 rounded-lg object-cover" />
                      <span className="font-semibold text-[#E1E0CC] group-hover:text-[#DEDBC8]">{track.title}</span>
                    </td>
                    <td className="py-3 text-gray-300">{track.artist}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-black text-[10px] font-medium text-gray-400">
                        {track.genre[0]}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-3">
                      <MatchScore score={88 + (index % 10)} size="sm" showLabel={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

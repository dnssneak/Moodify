import React, { useState } from 'react';
import { Plus, ListMusic, Trash2, Play, X } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useMusicStore } from '../store/useMusicStore';
import type { Playlist } from '../types/music';

export const PlaylistsPage: React.FC = () => {
  const { playlists, createPlaylist, deletePlaylist, removeTrackFromPlaylist } = usePlaylistStore();
  const { playTrack } = useMusicStore();

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(playlists[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = createPlaylist(newTitle, newDesc);
    setSelectedPlaylist(created);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-12 max-w-7xl mx-auto flex flex-col gap-6 pb-32 text-[#E1E0CC]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#E1E0CC] flex items-center gap-3">
            <ListMusic className="w-8 h-8 text-[#DEDBC8]" /> Playlists
          </h1>
          <p className="text-xs md:text-sm text-gray-400">Manage your custom created playlists and AI curated collections.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2.5 px-5 text-xs shadow-xl"
        >
          <Plus className="w-4 h-4" /> Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Playlist Cards Grid */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setSelectedPlaylist(pl)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-md ${
                selectedPlaylist?.id === pl.id
                  ? 'border-[#DEDBC8] bg-white/10 shadow-lg'
                  : 'border-white/10 glass-card hover:bg-white/5'
              }`}
            >
              <img src={pl.artwork} alt={pl.name} className="h-14 w-14 rounded-xl object-cover border border-white/10" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {pl.generatedByAI && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#DEDBC8]/20 text-[#DEDBC8]">
                      AI
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">{pl.tracks.length} tracks</span>
                </div>
                <h3 className="font-bold text-sm text-[#E1E0CC] truncate mt-0.5">{pl.name}</h3>
                <p className="text-xs text-gray-400 truncate">{pl.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Playlist Detail View */}
        <div className="md:col-span-7">
          {selectedPlaylist ? (
            <div className="p-6 md:p-8 rounded-3xl border border-white/15 glass-panel flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DEDBC8]/20 text-[#DEDBC8] text-xs font-semibold border border-[#DEDBC8]/30">
                      {selectedPlaylist.mood}
                    </span>
                    <span className="text-xs text-gray-400">Created {selectedPlaylist.createdAt}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#E1E0CC] mt-2">{selectedPlaylist.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedPlaylist.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPlaylist.tracks.length > 0 && (
                    <button
                      onClick={() => playTrack(selectedPlaylist.tracks[0])}
                      className="btn-primary-circle h-11 w-11 shadow-lg"
                      title="Play Playlist"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deletePlaylist(selectedPlaylist.id);
                      setSelectedPlaylist(playlists.find((p) => p.id !== selectedPlaylist.id) || null);
                    }}
                    className="p-2.5 rounded-full bg-black text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tracklist Table */}
              <div className="divide-y divide-white/5">
                {selectedPlaylist.tracks.length > 0 ? (
                  selectedPlaylist.tracks.map((track, idx) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0" onClick={() => playTrack(track)}>
                        <span className="text-xs text-gray-500 font-bold w-4">{idx + 1}</span>
                        <img src={track.artwork} alt={track.title} className="h-10 w-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#E1E0CC] group-hover:text-[#DEDBC8] truncate">
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeTrackFromPlaylist(selectedPlaylist.id, track.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-rose-400 transition-all cursor-pointer"
                        title="Remove track"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No tracks in this playlist yet. Browse Discovery or Track Details to add songs.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl text-center text-gray-400 text-sm bg-[#101010] border border-white/5">
              Select or create a playlist to view tracks.
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-[#101010]">
            <h3 className="text-lg font-bold text-[#E1E0CC] mb-4">Create Custom Playlist</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold">Playlist Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rainy Study Beats"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-black border border-white/10 text-[#E1E0CC] focus:outline-none focus:border-[#DEDBC8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of your playlist context..."
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-black border border-white/10 text-[#E1E0CC] focus:outline-none focus:border-[#DEDBC8] h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-black text-xs font-bold shadow-md cursor-pointer"
                  style={{ backgroundColor: '#DEDBC8' }}
                >
                  Save Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

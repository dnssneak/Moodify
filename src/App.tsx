import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HangingNavbar } from './components/layout/HangingNavbar';
import { PlayerBar } from './components/layout/PlayerBar';
import { TrackDetailModal } from './components/music/TrackDetailModal';

import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { AIPlaylistGeneratorPage } from './pages/AIPlaylistGeneratorPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LibraryPage } from './pages/LibraryPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-black text-[#E1E0CC] antialiased select-none relative">
        {/* Global Top-Hanging Navbar Pill */}
        <HangingNavbar />

        {/* Main Application Routes */}
        <main className="w-full min-h-screen bg-black">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/search" element={<DiscoverPage />} />
            <Route path="/ai-playlist" element={<AIPlaylistGeneratorPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Sticky Bottom Web Audio Player Bar */}
        <PlayerBar />

        {/* Explainable Track Detail Modal */}
        <TrackDetailModal />
      </div>
    </BrowserRouter>
  );
};

export default App;

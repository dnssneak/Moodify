import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const HangingNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Our story', path: '/' },
    { name: 'AI Discovery', path: '/discover' },
    { name: 'AI Generator', path: '/ai-playlist' },
    { name: 'Playlists', path: '/playlists' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Library', path: '/library' },
    { name: 'Artists', path: '/artists' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 max-w-[94vw] lg:max-w-7xl rounded-full px-2 py-1.5 sm:px-4 sm:py-2 glass-panel border border-white/15 shadow-2xl select-none transition-all">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                isActive
                  ? 'bg-[#DEDBC8] text-black shadow-md shadow-[#DEDBC8]/20 font-bold scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

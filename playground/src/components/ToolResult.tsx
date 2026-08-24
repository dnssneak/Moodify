import React from 'react';

export interface RecommendedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  matchScore: number;
  reasoning: string;
}

export interface ToolResultProps {
  toolName: string;
  query: string;
  tracks: RecommendedTrack[];
  onSaveTrack?: (track: RecommendedTrack) => void;
}

export const ToolResult: React.FC<ToolResultProps> = ({
  toolName,
  query,
  tracks,
  onSaveTrack,
}) => {
  return (
    <section
      role="region"
      aria-label={`AI Recommendation Tool Result for query: ${query}`}
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginTop: '1rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '0.5rem',
        }}
      >
        <h4 style={{ margin: 0, color: '#818cf8', fontSize: '1.1rem' }}>
          ✨ AI Recommendations ({tracks.length} tracks)
        </h4>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          Tool: <code>{toolName}</code>
        </span>
      </header>

      {tracks.length === 0 ? (
        <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No recommendations matched this prompt.</p>
      ) : (
        <ul
          role="list"
          aria-label="Recommended music tracks"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {tracks.map((track) => (
            <li
              key={track.id}
              role="listitem"
              aria-label={`Track: ${track.title} by ${track.artist}`}
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{track.title}</strong>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {track.artist} • <em>{track.album}</em> ({track.genre})
                </span>
                <span style={{ color: '#c7d2fe', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  💡 {track.reasoning}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  role="meter"
                  aria-label={`AI Match score: ${track.matchScore}%`}
                  aria-valuenow={track.matchScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(99, 102, 241, 0.2)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                  }}
                >
                  <span style={{ color: '#a5b4fc', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {track.matchScore}%
                  </span>
                  <span style={{ color: '#6366f1', fontSize: '0.65rem', textTransform: 'uppercase' }}>Match</span>
                </div>

                {onSaveTrack && (
                  <button
                    type="button"
                    onClick={() => onSaveTrack(track)}
                    aria-label={`Save ${track.title} to playlist`}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      color: '#34d399',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    + Add to Playlist
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ToolResult;

import React, { useState, useRef } from 'react';
import { Modal } from './components/Modal';
import { Tabs, type TabItem } from './components/Tabs';
import { Disclosure } from './components/Disclosure';
import { ShadcnDialogDemo } from './components/shadcn/ShadcnDialogDemo';
import { ShadcnTabsDemo } from './components/shadcn/ShadcnTabsDemo';
import { DiscoveryForm, type DiscoveryFormValues } from './components/DiscoveryForm';
import { ChatMessageRenderer, type ChatMessage } from './components/ChatMessageRenderer';
import { ToolResult, type RecommendedTrack } from './components/ToolResult';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const initialInputRef = useRef<HTMLInputElement | null>(null);

  // FE-09 AI Chat & Tool Result State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<RecommendedTrack[]>([]);
  const [savedTracks, setSavedTracks] = useState<RecommendedTrack[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDiscoverySubmit = async (values: DiscoveryFormValues) => {
    setIsSubmitting(true);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      state: 'completed',
      parts: [{ type: 'text', content: `Find music for: "${values.prompt}" (Mood: ${values.mood}, Tracks: ${values.trackCount})` }],
    };

    const initialAssistantMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      state: 'pending',
      parts: [],
    };

    setChatMessages((prev) => [...prev, newUserMsg, initialAssistantMsg]);

    try {
      // Attempt API call to /api/chat (intercepted in Playwright E2E or mocked in tests)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                state: 'completed',
                parts: [
                  { type: 'reasoning', content: data.reasoning || `Analyzed requested mood "${values.mood}" and prompt.` },
                  { type: 'text', content: data.reply || `Here are your ${values.trackCount} matched tracks:` },
                  { type: 'tool-result', toolName: 'recommend-music', result: data.tracks || [] },
                ],
              }
            : msg
        )
      );

      if (data.tracks) {
        setRecommendedTracks(data.tracks);
      }
    } catch (err: unknown) {
      // Fallback for standalone dev server without mock server running: mock successful response directly
      const mockTracks: RecommendedTrack[] = [
        {
          id: 'track-1',
          title: 'Midnight Drift',
          artist: 'Lunar Eclipse',
          album: 'Nocturnal Echoes',
          genre: 'Lo-Fi Chill',
          matchScore: 96,
          reasoning: 'Matches atmospheric night vibe with slow tempo.',
        },
        {
          id: 'track-2',
          title: 'Neon Skyline',
          artist: 'Synthwave Dreams',
          album: 'Retro Future',
          genre: 'Synthwave',
          matchScore: 91,
          reasoning: 'Captures dreamy electronic synthesizer pads.',
        },
      ];

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                state: 'completed',
                parts: [
                  { type: 'reasoning', content: `Analyzed mood "${values.mood}" for prompt "${values.prompt}".` },
                  { type: 'text', content: `Found ${mockTracks.length} recommendations matching your request!` },
                  { type: 'tool-result', toolName: 'recommend-music', result: mockTracks },
                ],
              }
            : msg
        )
      );
      setRecommendedTracks(mockTracks);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTrack = (track: RecommendedTrack) => {
    if (!savedTracks.some((t) => t.id === track.id)) {
      setSavedTracks((prev) => [...prev, track]);
    }
  };

  const tabItems: TabItem[] = [
    {
      id: 'accessibility',
      label: 'W3C Accessibility',
      content: (
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>W3C ARIA Authoring Practices</h4>
          <p style={{ color: '#9ca3af' }}>
            Hand-built tabs implement <code>role="tablist"</code>, <code>role="tab"</code>, and <code>role="tabpanel"</code>.
          </p>
        </div>
      ),
    },
    {
      id: 'keyboard',
      label: 'Keyboard Controls',
      content: (
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Keyboard Arrow Navigation</h4>
          <p style={{ color: '#9ca3af' }}>
            Use <kbd>←</kbd> and <kbd>→</kbd> arrow keys to switch between tabs.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="playground-container">
      <header className="playground-header">
        <h1 className="playground-title">Moodify FE-09 Playground</h1>
        <p className="playground-subtitle">
          AI Music Discovery & Testing Suite Playground — Component Tests & Playwright E2E Flow
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Validated AI Discovery Form & Chat Output */}
        <section className="component-card" aria-label="AI Discovery Console">
          <h2 className="component-card-title">1. Validated AI Music Discovery Form</h2>
          <DiscoveryForm onSubmit={handleDiscoverySubmit} isSubmitting={isSubmitting} />

          {chatMessages.length > 0 && (
            <section style={{ marginTop: '1.5rem' }} aria-label="Chat Conversation Stream">
              <h3 style={{ color: '#c7d2fe', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                💬 Chat Stream ({chatMessages.length} messages)
              </h3>
              {chatMessages.map((msg) => (
                <ChatMessageRenderer key={msg.id} message={msg} />
              ))}
            </section>
          )}

          {recommendedTracks.length > 0 && (
            <ToolResult
              toolName="recommend-music"
              query="AI Discovery Query"
              tracks={recommendedTracks}
              onSaveTrack={handleSaveTrack}
            />
          )}

          {savedTracks.length > 0 && (
            <div
              role="region"
              aria-label="Saved Playlist Library"
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <h4 style={{ margin: 0, color: '#34d399' }}>
                📁 Saved Tracks in Library ({savedTracks.length})
              </h4>
              <ul style={{ marginTop: '0.5rem', color: '#e5e7eb', paddingLeft: '1.25rem' }}>
                {savedTracks.map((t) => (
                  <li key={t.id}>
                    <strong>{t.title}</strong> — {t.artist}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Section 2: Legacy FE-05 Accessible Components */}
        <section className="component-card">
          <div className="component-card-header">
            <h2 className="component-card-title">2. Accessible Components & Modal</h2>
            <span className="badge badge-custom">Hand-Built</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="custom-btn-primary"
            aria-label="Open Custom Modal Dialog"
          >
            Open Custom Modal Dialog
          </button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Accessible Hand-Built Modal"
            description="Test focus trapping with Tab / Shift+Tab and close with Escape key."
            initialFocusRef={initialInputRef}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label htmlFor="modal-name-input" style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Your Name:
              </label>
              <input
                id="modal-name-input"
                ref={initialInputRef}
                type="text"
                placeholder="Enter your name..."
                className="custom-input"
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="custom-btn-primary"
              >
                Close Modal
              </button>
            </div>
          </Modal>

          <div style={{ marginTop: '1.5rem' }}>
            <Tabs items={tabItems} ariaLabel="Assignment Information Tabs" />
          </div>
        </section>

        <section className="component-card">
          <ShadcnDialogDemo />
          <div style={{ marginTop: '1rem' }}>
            <ShadcnTabsDemo />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

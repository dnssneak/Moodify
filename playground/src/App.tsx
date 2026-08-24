import React, { useState, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIDiscoveryFlow } from './components/AIDiscoveryFlow';
import { Modal } from './components/Modal';
import { Tabs, type TabItem } from './components/Tabs';
import { Disclosure } from './components/Disclosure';
import { ShadcnDialogDemo } from './components/shadcn/ShadcnDialogDemo';
import { ShadcnTabsDemo } from './components/shadcn/ShadcnTabsDemo';
import { Sparkles, Layers } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fe08' | 'fe05'>('fe08');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shouldCrash, setShouldCrash] = useState<boolean>(false);
  const initialInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger simulated React rendering exception to test ErrorBoundary
  if (shouldCrash) {
    throw new Error('Sabotage Simulation: Uncaught React rendering crash in App main tree!');
  }

  const tabItems: TabItem[] = [
    {
      id: 'accessibility',
      label: 'W3C Accessibility',
      content: (
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>W3C ARIA Authoring Practices</h4>
          <p style={{ color: '#9ca3af' }}>
            Hand-built tabs implement <code>role="tablist"</code>, <code>role="tab"</code>, and <code>role="tabpanel"</code>.
            Only the selected tab is in the focus sequence (<code>tabIndex={0}</code>) while inactive tabs have <code>tabIndex={-1}</code>.
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
            Use <kbd>←</kbd> and <kbd>→</kbd> arrow keys to switch between tabs. <kbd>Home</kbd> jumps to the first tab, and <kbd>End</kbd> jumps to the last tab.
          </p>
        </div>
      ),
    },
    {
      id: 'typescript',
      label: 'Strict TypeScript',
      content: (
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Type Safety</h4>
          <p style={{ color: '#9ca3af' }}>
            All component props are strongly typed with explicit React interfaces. Zero <code>any</code> type escapes permitted.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="playground-container">
      <header className="playground-header">
        <div className="header-top-row">
          <h1 className="playground-title">
            <span className="brand-highlight">Moodify</span> AI Music Curator
          </h1>
          <span className="badge badge-primary">FE-08 Assignment</span>
        </div>
        <p className="playground-subtitle">
          Primary Discovery Flow — Error States, Empty States, Skeletons, &amp; Sabotage Resilience Suite
        </p>

        {/* Top Level Navigation Tabs */}
        <div className="top-navigation-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'fe08'}
            onClick={() => setActiveTab('fe08')}
            className={`nav-tab-btn ${activeTab === 'fe08' ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>FE-08: AI Primary Discovery Flow</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'fe05'}
            onClick={() => setActiveTab('fe05')}
            className={`nav-tab-btn ${activeTab === 'fe05' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>FE-05: Accessible Components Demo</span>
          </button>
        </div>
      </header>

      <main className="main-content-area">
        {activeTab === 'fe08' ? (
          <AIDiscoveryFlow onTriggerBoundaryCrash={() => setShouldCrash(true)} />
        ) : (
          <div className="fe05-legacy-suite">
            <section className="keyboard-instructions">
              <h3>⌨️ Keyboard Testing Quick Guide</h3>
              <ul>
                <li><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>: Navigate focusable elements</li>
                <li><kbd>Escape</kbd>: Close active modal dialog</li>
                <li><kbd>←</kbd> / <kbd>→</kbd>: Move focus across tabs</li>
                <li><kbd>Home</kbd> / <kbd>End</kbd>: Jump to first/last tab</li>
                <li><kbd>Space</kbd> / <kbd>Enter</kbd>: Toggle disclosure &amp; buttons</li>
              </ul>
            </section>

            <div className="component-grid">
              {/* Modal Component */}
              <section className="component-card">
                <div className="component-card-header">
                  <h2 className="component-card-title">1. Modal Dialog</h2>
                  <span className="badge badge-custom">Hand-Built (Custom)</span>
                </div>
                <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                  W3C pattern featuring focus trap, focus restoration on close, <code>aria-modal="true"</code>, and <kbd>Escape</kbd> key handler.
                </p>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="custom-btn-primary"
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
                      Your Name (Auto-focused initial element):
                    </label>
                    <input
                      id="modal-name-input"
                      ref={initialInputRef}
                      type="text"
                      placeholder="Enter your name..."
                      className="custom-input"
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="custom-btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="custom-btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </Modal>
              </section>

              {/* Tabs Component */}
              <section className="component-card">
                <div className="component-card-header">
                  <h2 className="component-card-title">2. Accessible Tabs</h2>
                  <span className="badge badge-custom">Hand-Built (Custom)</span>
                </div>
                <Tabs items={tabItems} ariaLabel="Assignment Information Tabs" />
              </section>

              {/* Disclosure Component */}
              <section className="component-card">
                <div className="component-card-header">
                  <h2 className="component-card-title">3. Disclosure Component</h2>
                  <span className="badge badge-custom">Hand-Built (Custom)</span>
                </div>
                <Disclosure title="What makes a component accessible?">
                  Accessible components combine proper ARIA roles, robust keyboard interaction models, clear visual focus indicators, and strict focus management.
                </Disclosure>
              </section>

              {/* Shadcn Comparison */}
              <section className="component-card" style={{ borderColor: '#6366f1' }}>
                <div className="component-card-header">
                  <h2 className="component-card-title">4. Shadcn UI / Radix Comparison</h2>
                  <span className="badge badge-shadcn">Shadcn / Radix UI</span>
                </div>
                <div className="comparison-grid">
                  <div>
                    <h4 style={{ color: '#818cf8', marginBottom: '0.5rem' }}>Radix Dialog</h4>
                    <ShadcnDialogDemo />
                  </div>
                  <div>
                    <h4 style={{ color: '#818cf8', marginBottom: '0.5rem' }}>Radix Tabs</h4>
                    <ShadcnTabsDemo />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;

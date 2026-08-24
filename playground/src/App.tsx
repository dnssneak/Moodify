import React, { useState, useRef } from 'react';
import { Modal } from './components/Modal';
import { Tabs, type TabItem } from './components/Tabs';
import { Disclosure } from './components/Disclosure';
import { ShadcnDialogDemo } from './components/shadcn/ShadcnDialogDemo';
import { ShadcnTabsDemo } from './components/shadcn/ShadcnTabsDemo';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const initialInputRef = useRef<HTMLInputElement | null>(null);

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
        <h1 className="playground-title">Accessible Component Fundamentals</h1>
        <p className="playground-subtitle">
          FE-05 Assignment Playground — Hand-built W3C ARIA Components vs Shadcn/Radix UI
        </p>
      </header>

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

      <main className="component-grid">
        {/* Component 1: Hand-built Accessible Modal Dialog */}
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

              <label htmlFor="modal-feedback-input" style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Feedback / Notes:
              </label>
              <textarea
                id="modal-feedback-input"
                rows={3}
                placeholder="Type your notes here..."
                className="custom-input"
                style={{ resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #4b5563',
                    color: '#e5e7eb',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
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

        {/* Component 2: Hand-built Accessible Tabs */}
        <section className="component-card">
          <div className="component-card-header">
            <h2 className="component-card-title">2. Accessible Tabs</h2>
            <span className="badge badge-custom">Hand-Built (Custom)</span>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
            W3C pattern featuring roving <code>tabIndex</code> and keyboard arrow key navigation (<kbd>←</kbd> <kbd>→</kbd> <kbd>Home</kbd> <kbd>End</kbd>).
          </p>

          <Tabs items={tabItems} ariaLabel="Assignment Information Tabs" />
        </section>

        {/* Component 3: Hand-built Accessible Disclosure */}
        <section className="component-card">
          <div className="component-card-header">
            <h2 className="component-card-title">3. Disclosure Component</h2>
            <span className="badge badge-custom">Hand-Built (Custom)</span>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
            W3C pattern using native <code>&lt;button aria-expanded aria-controls&gt;</code> and panel region.
          </p>

          <Disclosure title="What makes a component accessible?">
            Accessible components combine proper ARIA roles, robust keyboard interaction models, clear visual focus indicators, and strict focus management to allow users with screen readers or keyboard-only navigation to interact seamlessly.
          </Disclosure>

          <Disclosure title="Why build components by hand before using libraries?">
            AI code generators frequently omit edge cases like focus traps, roving tab indexes, and background inertness. Building components from scratch builds deep fundamental knowledge essential for auditing AI-generated output.
          </Disclosure>
        </section>

        {/* Component 4 & 5: Shadcn UI Comparison */}
        <section className="component-card" style={{ borderColor: '#6366f1' }}>
          <div className="component-card-header">
            <h2 className="component-card-title">4. Shadcn UI / Radix Comparison</h2>
            <span className="badge badge-shadcn">Shadcn / Radix UI</span>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '1.25rem' }}>
            Explore side-by-side implementations built using Radix UI primitives (`@radix-ui/react-dialog` &amp; `@radix-ui/react-tabs`).
          </p>

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
      </main>
    </div>
  );
};

export default App;

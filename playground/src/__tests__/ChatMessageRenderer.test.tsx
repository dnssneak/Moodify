import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ChatMessageRenderer, type ChatMessage } from '../components/ChatMessageRenderer';

describe('ChatMessageRenderer Component', () => {
  it('renders pending state with role="status" and accessible label', () => {
    const pendingMessage: ChatMessage = {
      id: 'msg-1',
      role: 'assistant',
      state: 'pending',
      parts: [],
    };

    render(<ChatMessageRenderer message={pendingMessage} />);

    // Query strictly by ARIA role and label
    const statusElement = screen.getByRole('status', { name: /ai response pending/i });
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveTextContent('AI is thinking...');
  });

  it('renders streaming state with text parts and streaming indicator', () => {
    const streamingMessage: ChatMessage = {
      id: 'msg-2',
      role: 'assistant',
      state: 'streaming',
      parts: [{ type: 'text', content: 'Generating personalized recommendations...' }],
    };

    render(<ChatMessageRenderer message={streamingMessage} />);

    // Query text content and status role
    expect(screen.getByRole('article', { name: 'Assistant response' })).toBeInTheDocument();
    expect(screen.getByText('Generating personalized recommendations...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /streaming response/i })).toBeInTheDocument();
  });

  it('renders completed state with reasoning and allows toggling reasoning details', async () => {
    const user = userEvent.setup();
    const completedMessage: ChatMessage = {
      id: 'msg-3',
      role: 'assistant',
      state: 'completed',
      parts: [
        { type: 'reasoning', content: 'Analyzed requested acoustic chill mood and slow tempo.' },
        { type: 'text', content: 'Here is your generated playlist response.' },
        { type: 'tool-invocation', toolName: 'recommend-music', args: { mood: 'chill' } },
      ],
    };

    render(<ChatMessageRenderer message={completedMessage} />);

    // Verify main article role
    expect(screen.getByRole('article', { name: 'Assistant response' })).toBeInTheDocument();
    expect(screen.getByText('Here is your generated playlist response.')).toBeInTheDocument();

    // Verify tool invocation region
    expect(screen.getByRole('region', { name: /executing tool: recommend-music/i })).toBeInTheDocument();

    // Verify reasoning section button by role and accessible name
    const toggleButton = screen.getByRole('button', { name: /toggle ai reasoning process/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Toggle reasoning open
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Analyzed requested acoustic chill mood and slow tempo.')).toBeInTheDocument();
  });

  it('renders error state with role="alert" and descriptive error message', () => {
    const errorMessage: ChatMessage = {
      id: 'msg-4',
      role: 'assistant',
      state: 'error',
      parts: [],
      errorMessage: 'Network timeout connecting to AI recommendation server.',
    };

    render(<ChatMessageRenderer message={errorMessage} />);

    // Query alert role
    const alertElement = screen.getByRole('alert', { name: /error generating response/i });
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveTextContent('Network timeout connecting to AI recommendation server.');
  });
});

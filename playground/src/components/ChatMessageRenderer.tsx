import React, { useState } from 'react';

export type PartType = 'text' | 'reasoning' | 'tool-invocation' | 'tool-result';

export interface TextPart {
  type: 'text';
  content: string;
}

export interface ReasoningPart {
  type: 'reasoning';
  content: string;
}

export interface ToolInvocationPart {
  type: 'tool-invocation';
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolResultPart {
  type: 'tool-result';
  toolName: string;
  result: unknown;
}

export type MessagePart = TextPart | ReasoningPart | ToolInvocationPart | ToolResultPart;

export type MessageState = 'pending' | 'streaming' | 'completed' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  state: MessageState;
  parts: MessagePart[];
  errorMessage?: string;
}

export interface ChatMessageRendererProps {
  message: ChatMessage;
}

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ message }) => {
  const [showReasoning, setShowReasoning] = useState<boolean>(false);

  const isAssistant = message.role === 'assistant';
  const roleLabel = isAssistant ? 'Assistant response' : 'User message';

  return (
    <article
      className={`chat-message chat-message-${message.role}`}
      aria-label={roleLabel}
      style={{
        padding: '1rem',
        borderRadius: '8px',
        background: isAssistant ? 'rgba(30, 41, 59, 0.7)' : 'rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1rem',
        color: '#f3f4f6',
      }}
    >
      <header
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          color: '#9ca3af',
        }}
      >
        <strong>{isAssistant ? 'Moodify AI' : 'You'}</strong>
        <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
          {message.state}
        </span>
      </header>

      {/* State: Pending */}
      {message.state === 'pending' && (
        <div role="status" aria-label="AI response pending" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc' }}>
          <span className="spinner" aria-hidden="true">⏳</span>
          <span>AI is thinking...</span>
        </div>
      )}

      {/* State: Error */}
      {message.state === 'error' && (
        <div
          role="alert"
          aria-label="Error generating response"
          style={{
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            color: '#f87171',
            marginBottom: '0.5rem',
          }}
        >
          <strong>Error:</strong> {message.errorMessage || 'Failed to generate AI response. Please try again.'}
        </div>
      )}

      {/* Render Message Parts */}
      <div className="message-parts" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {message.parts.map((part, index) => {
          if (part.type === 'reasoning') {
            return (
              <section
                key={`reasoning-${index}`}
                role="region"
                aria-label="AI reasoning process"
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  borderLeft: '3px solid #818cf8',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowReasoning(!showReasoning)}
                  aria-expanded={showReasoning}
                  aria-label="Toggle AI reasoning process"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#c7d2fe',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    padding: 0,
                  }}
                >
                  {showReasoning ? '▼ Hide AI Thinking Process' : '► Show AI Thinking Process'}
                </button>
                {showReasoning && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>
                    {part.content}
                  </p>
                )}
              </section>
            );
          }

          if (part.type === 'text') {
            return (
              <div key={`text-${index}`} className="part-text" style={{ lineHeight: '1.5' }}>
                <p>{part.content}</p>
              </div>
            );
          }

          if (part.type === 'tool-invocation') {
            return (
              <section
                key={`tool-inv-${index}`}
                role="region"
                aria-label={`Executing tool: ${part.toolName}`}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#93c5fd',
                }}
              >
                ⚙️ Running tool <code>{part.toolName}</code>...
              </section>
            );
          }

          if (part.type === 'tool-result') {
            return (
              <section
                key={`tool-res-${index}`}
                role="region"
                aria-label={`Tool result for ${part.toolName}`}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <strong>Tool Result ({part.toolName}):</strong>
                <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a7f3d0', overflowX: 'auto' }}>
                  {JSON.stringify(part.result, null, 2)}
                </pre>
              </section>
            );
          }

          return null;
        })}
      </div>

      {/* State: Streaming Indicator */}
      {message.state === 'streaming' && (
        <div role="status" aria-label="Streaming response" style={{ marginTop: '0.5rem', color: '#a5b4fc', fontSize: '0.85rem' }}>
          <span aria-hidden="true">▍</span> Streaming content...
        </div>
      )}
    </article>
  );
};

export default ChatMessageRenderer;

import React, { useState } from 'react';

export interface DiscoveryFormValues {
  prompt: string;
  mood: string;
  trackCount: number;
}

export interface DiscoveryFormProps {
  onSubmit: (values: DiscoveryFormValues) => void;
  isSubmitting?: boolean;
}

export const DiscoveryForm: React.FC<DiscoveryFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [mood, setMood] = useState<string>('calm');
  const [trackCount, setTrackCount] = useState<number>(5);

  const [errors, setErrors] = useState<{ prompt?: string; trackCount?: string }>({});

  const validate = (): boolean => {
    const newErrors: { prompt?: string; trackCount?: string } = {};

    if (!prompt.trim()) {
      newErrors.prompt = 'Music description prompt is required.';
    } else if (prompt.trim().length < 3) {
      newErrors.prompt = 'Prompt must be at least 3 characters long.';
    }

    if (isNaN(trackCount) || trackCount < 1 || trackCount > 20) {
      newErrors.trackCount = 'Track count must be between 1 and 20.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ prompt: prompt.trim(), mood, trackCount });
    }
  };

  return (
    <form
      aria-label="AI Music Discovery Request Form"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: 'rgba(17, 24, 39, 0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
      }}
    >
      <h3 style={{ margin: 0, color: '#f3f4f6', fontSize: '1.25rem' }}>
        🎵 AI Music Discovery Generator
      </h3>

      {/* Input 1: Natural language prompt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label htmlFor="prompt-input" style={{ color: '#e5e7eb', fontSize: '0.875rem', fontWeight: 600 }}>
          Describe your vibe or desired atmosphere:
        </label>
        <input
          id="prompt-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Dreamy lo-fi beats for late-night coding"
          aria-invalid={Boolean(errors.prompt)}
          aria-describedby={errors.prompt ? 'prompt-error' : undefined}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: errors.prompt ? '1px solid #ef4444' : '1px solid #4b5563',
            background: '#1f2937',
            color: '#ffffff',
            fontSize: '0.95rem',
          }}
        />
        {errors.prompt && (
          <span id="prompt-error" role="alert" style={{ color: '#f87171', fontSize: '0.8rem' }}>
            {errors.prompt}
          </span>
        )}
      </div>

      {/* Input 2: Mood Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label htmlFor="mood-select" style={{ color: '#e5e7eb', fontSize: '0.875rem', fontWeight: 600 }}>
          Select primary mood:
        </label>
        <select
          id="mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #4b5563',
            background: '#1f2937',
            color: '#ffffff',
            fontSize: '0.95rem',
          }}
        >
          <option value="calm">Calm & Relaxed</option>
          <option value="focused">Deep Focus</option>
          <option value="energetic">Energetic Workout</option>
          <option value="dreamy">Dreamy & Melancholic</option>
          <option value="happy">Uplifting & Happy</option>
        </select>
      </div>

      {/* Input 3: Track Count */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label htmlFor="track-count-input" style={{ color: '#e5e7eb', fontSize: '0.875rem', fontWeight: 600 }}>
          Number of tracks (1 to 20):
        </label>
        <input
          id="track-count-input"
          type="number"
          min={1}
          max={20}
          value={Number.isNaN(trackCount) ? '' : trackCount}
          onChange={(e) => setTrackCount(e.target.value === '' ? NaN : parseInt(e.target.value, 10))}
          aria-invalid={Boolean(errors.trackCount)}
          aria-describedby={errors.trackCount ? 'track-count-error' : undefined}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: errors.trackCount ? '1px solid #ef4444' : '1px solid #4b5563',
            background: '#1f2937',
            color: '#ffffff',
            fontSize: '0.95rem',
          }}
        />
        {errors.trackCount && (
          <span id="track-count-error" role="alert" style={{ color: '#f87171', fontSize: '0.8rem' }}>
            {errors.trackCount}
          </span>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Generate AI Recommendations"
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#ffffff',
          fontWeight: 'bold',
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? 'Generating Recommendations...' : 'Generate AI Recommendations'}
      </button>
    </form>
  );
};

export default DiscoveryForm;

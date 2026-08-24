import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToolResult, type RecommendedTrack } from '../components/ToolResult';

describe('ToolResult Component', () => {
  const mockTracks: RecommendedTrack[] = [
    {
      id: 'track-101',
      title: 'Starlight Waves',
      artist: 'Cosmic Ambient',
      album: 'Space Odyssey',
      genre: 'Ambient',
      matchScore: 98,
      reasoning: 'Perfect match for calm atmospheric request.',
    },
    {
      id: 'track-102',
      title: 'Solar Flare',
      artist: 'Nova Sound',
      album: 'Supernova',
      genre: 'Electronic',
      matchScore: 88,
      reasoning: 'Uplifting synth progression.',
    },
  ];

  it('renders track recommendations list and meter values using ARIA roles', () => {
    render(
      <ToolResult
        toolName="recommend-music"
        query="Ambient study music"
        tracks={mockTracks}
      />
    );

    // Verify region role and label
    const region = screen.getByRole('region', { name: /ai recommendation tool result for query: ambient study music/i });
    expect(region).toBeInTheDocument();

    // Verify list and listitems
    const list = screen.getByRole('list', { name: /recommended music tracks/i });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    // Verify track 1 content
    expect(screen.getByRole('listitem', { name: 'Track: Starlight Waves by Cosmic Ambient' })).toBeInTheDocument();

    // Verify meter role for match score
    const meter = screen.getByRole('meter', { name: 'AI Match score: 98%' });
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuenow', '98');
  });

  it('triggers onSaveTrack callback when Add to Playlist button is clicked', async () => {
    const user = userEvent.setup();
    const handleSaveTrack = vi.fn();

    render(
      <ToolResult
        toolName="recommend-music"
        query="Ambient study music"
        tracks={mockTracks}
        onSaveTrack={handleSaveTrack}
      />
    );

    // Query button by role and accessible label
    const saveButton = screen.getByRole('button', { name: 'Save Starlight Waves to playlist' });
    expect(saveButton).toBeInTheDocument();

    await user.click(saveButton);

    expect(handleSaveTrack).toHaveBeenCalledTimes(1);
    expect(handleSaveTrack).toHaveBeenCalledWith(mockTracks[0]);
  });
});

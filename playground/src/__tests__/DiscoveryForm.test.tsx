import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DiscoveryForm } from '../components/DiscoveryForm';

describe('DiscoveryForm Component', () => {
  it('displays role="alert" error message when prompt is submitted empty or too short', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<DiscoveryForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /generate ai recommendations/i });

    // Submit without typing prompt
    await user.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled();

    // Verify alert message by role
    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('Music description prompt is required.');

    // Verify input aria-invalid status
    const promptInput = screen.getByRole('textbox', { name: /describe your vibe/i });
    expect(promptInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits form with user inputs when valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<DiscoveryForm onSubmit={handleSubmit} />);

    const promptInput = screen.getByRole('textbox', { name: /describe your vibe/i });
    const moodSelect = screen.getByRole('combobox', { name: /select primary mood/i });
    const trackCountInput = screen.getByRole('spinbutton', { name: /number of tracks/i });
    const submitButton = screen.getByRole('button', { name: /generate ai recommendations/i });

    // Type valid prompt
    await user.type(promptInput, 'Chill acoustic guitar for reading');
    await user.selectOptions(moodSelect, 'focused');
    await user.clear(trackCountInput);
    await user.type(trackCountInput, '8');

    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      prompt: 'Chill acoustic guitar for reading',
      mood: 'focused',
      trackCount: 8,
    });
  });
});

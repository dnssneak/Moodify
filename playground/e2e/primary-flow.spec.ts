import { test, expect } from '@playwright/test';

test.describe('Moodify Primary Discovery Flow E2E', () => {
  test('user can submit AI discovery request, view chat output & tool results, and add track to playlist', async ({ page }) => {
    // Mock the AI route (/api/chat) to return deterministic mock data without external API calls
    await page.route('**/api/chat', async (route) => {
      const jsonResponse = {
        reasoning: 'Analyzed requested dreamy mood and late-night vibe.',
        reply: 'Here are your recommended tracks for late-night driving:',
        tracks: [
          {
            id: 'e2e-track-1',
            title: 'Midnight City Lights',
            artist: 'Synth Dreamers',
            album: 'Urban Night',
            genre: 'Synthwave',
            matchScore: 98,
            reasoning: 'Smooth synth pads perfect for late-night drives.',
          },
        ],
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(jsonResponse),
      });
    });

    // 1. Visit the Moodify playground
    await page.goto('/');

    // Verify heading is visible
    await expect(page.getByRole('heading', { name: 'Moodify FE-09 Playground' })).toBeVisible();

    // 2. Fill out validated DiscoveryForm
    const promptInput = page.getByRole('textbox', { name: /describe your vibe/i });
    await promptInput.fill('Dreamy synthwave for late night drive');

    const moodSelect = page.getByRole('combobox', { name: /select primary mood/i });
    await moodSelect.selectOption('dreamy');

    // 3. Submit form
    const generateBtn = page.getByRole('button', { name: /generate ai recommendations/i });
    await generateBtn.click();

    // 4. Verify Assistant Chat Message appears
    const assistantMsg = page.getByRole('article', { name: 'Assistant response' });
    await expect(assistantMsg).toBeVisible();
    await expect(page.getByText('Here are your recommended tracks for late-night driving:')).toBeVisible();

    // 5. Verify Tool Result region and Track Card
    const toolRegion = page.getByRole('region', { name: /ai recommendation tool result/i });
    await expect(toolRegion).toBeVisible();
    await expect(page.getByRole('listitem', { name: 'Track: Midnight City Lights by Synth Dreamers' })).toBeVisible();
    await expect(page.getByRole('meter', { name: 'AI Match score: 98%' })).toBeVisible();

    // 6. Save track to playlist
    const saveBtn = page.getByRole('button', { name: 'Save Midnight City Lights to playlist' });
    await saveBtn.click();

    // 7. Verify saved tracks library updates
    const libraryRegion = page.getByRole('region', { name: 'Saved Playlist Library' });
    await expect(libraryRegion).toBeVisible();
    await expect(libraryRegion.getByText('Midnight City Lights')).toBeVisible();
  });
});

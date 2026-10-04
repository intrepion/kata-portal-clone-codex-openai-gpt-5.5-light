import { expect, test } from '@playwright/test';

test('MVP 3 preserves velocity through a portal pair to cross a fling gap', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/?testMode=1&chamber=3');
  await page.getByRole('button', { name: 'Begin Test Chamber' }).click();
  await page.waitForFunction(() => Boolean(window.portalCloneTest));

  const snapshot = await page.evaluate(() => window.portalCloneTest!.completeFlingSmoke());

  expect(snapshot.chamber).toBe(3);
  expect(snapshot.traversals).toBeGreaterThanOrEqual(1);
  expect(snapshot.flingComplete).toBe(true);
  expect(snapshot.chamberComplete).toBe(true);
  expect(snapshot.player.z).toBeLessThan(-2.8);
  expect(errors).toEqual([]);
});

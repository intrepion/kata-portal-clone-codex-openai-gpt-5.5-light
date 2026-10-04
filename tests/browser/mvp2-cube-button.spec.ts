import { expect, test } from '@playwright/test';

test('MVP 2 carries cube through a portal and opens the chamber exit', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/?testMode=1&chamber=2');
  await page.getByRole('button', { name: 'Begin Test Chamber' }).click();
  await page.waitForFunction(() => Boolean(window.portalCloneTest));

  const snapshot = await page.evaluate(() => window.portalCloneTest!.completeCubeButtonSmoke());

  expect(snapshot.chamber).toBe(2);
  expect(snapshot.carriedCube).toBe(false);
  expect(snapshot.cubeTraversals).toBeGreaterThanOrEqual(1);
  expect(snapshot.buttonPressed).toBe(true);
  expect(snapshot.exitOpen).toBe(true);
  expect(snapshot.chamberComplete).toBe(true);
  expect(errors).toEqual([]);
});

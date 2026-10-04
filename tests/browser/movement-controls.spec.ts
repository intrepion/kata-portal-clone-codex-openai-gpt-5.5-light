import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

test('W moves forward in the direction the player is facing', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${pathToFileURL(process.cwd())}/index.html?testMode=1&chamber=1`);
  await page.getByRole('button', { name: 'Begin Test Chamber' }).click();
  await page.waitForFunction(() => Boolean(window.portalCloneTest));

  const snapshot = await page.evaluate(() => window.portalCloneTest!.completeMovementSmoke());

  expect(snapshot.player.z).toBeGreaterThan(5);
  expect(errors).toEqual([]);
});

test('D strafes right relative to the direction the player is facing', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${pathToFileURL(process.cwd())}/index.html?testMode=1&chamber=1`);
  await page.getByRole('button', { name: 'Begin Test Chamber' }).click();
  await page.waitForFunction(() => Boolean(window.portalCloneTest));

  const snapshot = await page.evaluate(() => window.portalCloneTest!.completeStrafeSmoke());

  expect(snapshot.player.x).toBeLessThan(0);
  expect(errors).toEqual([]);
});

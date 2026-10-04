import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

test('root index launches under file protocol and completes traversal smoke', async ({ page }) => {
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

  const snapshot = await page.evaluate(() => window.portalCloneTest!.completeTraversalSmoke());

  expect(snapshot.portalViewsReady).toBe(true);
  expect(snapshot.traversals).toBeGreaterThanOrEqual(2);
  expect(errors).toEqual([]);
});

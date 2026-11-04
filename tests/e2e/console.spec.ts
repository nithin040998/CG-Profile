/* CONSOLE — a full walk with every interaction leaves the console clean. */
import { test, expect, settle, scrollElTo, scrollToY } from './fixtures';

test('no errors, warnings or hydration noise across a full interactive walk', async ({ page, consoleLog }) => {
  await page.goto('/');
  await settle(page);
  await page.mouse.move(1200, 400);
  for (const id of ['about', 'experience', 'impact', 'contact']) {
    await scrollElTo(page, `#${id}`, 0);
    await page.waitForTimeout(700);
  }
  await page.locator('#contact a[href^="tel:"]').hover();
  await scrollToY(page, 0);
  await page.locator('header a[href="#top"]').click();
  await page.locator('header').getByRole('link', { name: 'résumé', exact: true }).click();
  await page.waitForTimeout(1600);
  // the site ships no favicon yet — the browser's automatic request 404s
  expect(consoleLog.filter((l) => !l.includes('/favicon.ico'))).toEqual([]);
});

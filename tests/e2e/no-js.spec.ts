/* NO JS — a portfolio that hides its content behind a script is broken. */
import { test, expect } from './fixtures';

test.use({ javaScriptEnabled: false });

test('nothing is left hidden; the decorative companion stays out of the way', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000); // the CSS-only hero load sequence still plays
  const s = await page.evaluate(() => {
    const ops = (sel: string) => [...document.querySelectorAll(sel)].map((e) => getComputedStyle(e).opacity);
    return {
      reveals: ops('[data-reveal="up"], [data-reveal="stagger"] > *'),
      rows: ops('[data-xp-row], [data-xp-row] > * > *'),
      hero: ops('#top h1, #top > div p'),
      companion: getComputedStyle(document.getElementById('companion')!).opacity,
    };
  });
  expect(new Set([...s.reveals, ...s.rows, ...s.hero])).toEqual(new Set(['1']));
  expect(s.companion).toBe('0');
});

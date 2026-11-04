/* RESPONSIVE — "collapse, never shrink" (G), and pointer-only motion. */
import { test, expect, css, comp, settle, scrollElTo } from './fixtures';

test.describe('phone 390×844, touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });

  test('layout collapses: menu replaces links, CTAs stack, robot 132px, no scroll cue', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    expect((await css(page.locator('header nav ul'), ['display'])).display).toBe('none');
    expect((await css(page.getByRole('button', { name: 'Open menu' }), ['display'])).display).not.toBe('none');
    expect((await css(page.locator('#top a', { hasText: 'view experience' }).locator('..'), ['flex-direction']))['flex-direction']).toBe('column');
    expect((await page.locator('[data-dock]').first().boundingBox())!.width).toBe(132);
    expect((await comp(page)).width).toBe(132);
    expect((await css(page.getByText('scroll ↓'), ['display'])).display).toBe('none');
  });

  test('no gaze on touch', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await page.mouse.move(380, 300);
    await page.waitForTimeout(120);
    expect(await page.evaluate(() =>
      [...document.querySelectorAll<SVGElement>('#companion [data-pupil]')].map((p) => p.style.transform))).toEqual(['', '']);
  });

  test('rides the narrow spine: 40px, centred on the flush-left line, feet 6px below the dot', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await scrollElTo(page, '[data-xp-row]:nth-of-type(2)', 0.5);
    await page.waitForTimeout(3000);
    const c = await comp(page);
    const dots = await page.evaluate(() =>
      [...document.querySelectorAll('[data-spine-anchor]')].map((a) => {
        const r = a.getBoundingClientRect();
        return { x: r.left, y: r.top + 4 };
      }));
    expect(c.riding).toBe(true);
    expect(c.width).toBe(40);
    expect(Math.abs(c.left + c.width / 2 - dots[0].x)).toBeLessThan(0.6);
    const feet = c.top + c.width * 52 / 44;
    expect(Math.min(...dots.map((d) => Math.abs(d.y + 6 - feet)))).toBeLessThan(1);
  });
});

test.describe('tablet 900', () => {
  test.use({ viewport: { width: 900, height: 1100 } });

  test('the robot drops below the name at 160px, centred', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const dock = (await page.locator('[data-dock]').first().boundingBox())!;
    const name = (await page.locator('#top h1').boundingBox())!;
    expect(dock.width).toBe(160);
    expect(dock.y).toBeGreaterThan(name.y + name.height);
    const c = await comp(page);
    expect(Math.abs(c.left - dock.x)).toBeLessThan(1);
    expect(Math.abs(c.width - 160)).toBeLessThan(1);
  });
});

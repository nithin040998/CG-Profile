/* GUIDE — leading the reader. src/motion/guide/* + the companion controller */
import { test, expect, css, nums, comp, settle, scrollElTo, scrollToY, EASE_MORPH, EASE_OUT } from './fixtures';
import type { Page } from '@playwright/test';

const ROW_EXPR = ['looking', 'focused', 'curious', 'happy', 'content'];

/** the spine dot of each row, viewport coords (desktop: gutter centre, +11px) */
const dots = (page: Page) => page.evaluate(() =>
  [...document.querySelectorAll('[data-spine-anchor]')].map((a) => {
    const r = a.getBoundingClientRect();
    return innerWidth <= 1023 ? { x: r.left, y: r.top + 4 } : { x: r.left - 11.5, y: r.top + 11 };
  }));

const openCount = (page: Page) => page.locator('[data-xp-row][data-open]').count();

/** the trail's scaleY ('' before the descent starts) */
const trailScale = (page: Page) => page.evaluate(() =>
  (document.querySelector('[data-xp-row]')!.parentElement!.firstElementChild as HTMLElement).style.transform);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await settle(page);
});

test('docks: the companion lands exactly in each dock box', async ({ page }) => {
  const stops = [
    ['neutral', () => scrollToY(page, 0)],
    ['content', () => scrollElTo(page, '#about', 0)],
    ['surprised', () => scrollElTo(page, '#impact', 0)],
    ['content', () => scrollToY(page, 1e6)],
  ] as const;
  const docks = page.locator('[data-dock]');
  await expect(docks).toHaveCount(4);
  for (const [i, [want, go]] of stops.entries()) {
    await go();
    await page.waitForTimeout(1100);
    const d = await docks.nth(i).boundingBox();
    const c = await comp(page);
    expect(await docks.nth(i).getAttribute('data-dock')).toBe(want);
    expect(c.riding).toBe(false);
    expect(Math.abs(c.left - d!.x)).toBeLessThan(1);
    expect(Math.abs(c.top - d!.y)).toBeLessThan(1);
    expect(Math.abs(c.width - d!.width)).toBeLessThan(1);
    expect(Math.abs(c.height - c.width * 56 / 44)).toBeLessThan(1);
    expect(Math.abs(d!.height - d!.width * 56 / 44)).toBeLessThan(1);
  }
});

test('glide: 900ms morph between docks; the first placement lands without sweeping in', async ({ page }) => {
  // fresh load: track the companion every frame from the moment it is placed
  await page.goto('/');
  const xs = await page.evaluate(async () => {
    await new Promise((r) => { const f = () => (window.__comp().placed ? r(0) : requestAnimationFrame(f)); f(); });
    const out: number[] = [];
    const t0 = performance.now();
    await new Promise((r) => {
      const f = () => { out.push(window.__comp().left); performance.now() - t0 < 800 ? requestAnimationFrame(f) : r(0); };
      f();
    });
    return out;
  });
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(1);

  const c0 = await comp(page);
  expect(c0.transitionProperty).toBe('transform, width, opacity');
  expect(c0.transitionDuration).toBe('0.9s, 0.9s, 0.34s');
  expect(c0.transitionTiming).toBe(`${EASE_MORPH}, ${EASE_MORPH}, ${EASE_OUT}`);

  await page.waitForTimeout(2600);
  const start = await comp(page);
  await scrollElTo(page, '#about', 0);
  await page.waitForTimeout(300);
  const mid = await comp(page);
  await page.waitForTimeout(900);
  const end = await comp(page);
  expect(mid.left).toBeLessThan(start.left - 20);
  expect(mid.left).toBeGreaterThan(end.left + 20);
  expect(mid.width).toBeLessThan(start.width);
  expect(mid.width).toBeGreaterThan(end.width);
});

test('descent: rows are dealt one at a time, in order, each after the companion arrives', async ({ page }) => {
  await page.evaluate(() => window.__startExprLog());
  await scrollElTo(page, '#experience', 0);
  const trail: number[] = [];
  for (let k = 0; k < 26; k++) {
    await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const t = await trailScale(page);
    if (t) trail.push(nums(t)[0]);
  }
  await expect.poll(() => openCount(page), { timeout: 4000 }).toBe(5);
  await page.waitForTimeout(400);
  trail.push(nums(await trailScale(page))[0]);

  const { opens, log } = await page.evaluate(() => ({ opens: window.__opens, log: window.__exprLog }));
  expect(opens.map((o) => o.i)).toEqual([0, 1, 2, 3, 4]);
  for (let i = 1; i < opens.length; i++) {
    // dwell 720ms for the previous row's deal + a walk of at least 240ms
    expect(opens[i].t - opens[i - 1].t).toBeGreaterThan(900);
    const walking = log.filter((s) => s.t > opens[i - 1].t + 760 && s.t < opens[i].t - 20).map((s) => s.e);
    expect(walking).toContain('focused');
  }
  for (const [i, o] of opens.entries()) {
    const arrived = log.filter((s) => s.t > o.t + 60 && s.t < o.t + 650).map((s) => s.e);
    expect(arrived).toContain(ROW_EXPR[i]);
  }

  // the trail only ever grows, and reaches the last dot
  for (let i = 1; i < trail.length; i++) expect(trail[i]).toBeGreaterThanOrEqual(trail[i - 1]);
  expect(trail.at(-1)).toBe(1);
});

test('riding: stands ON the spine, feet 16px above the resting dot, glued to it while scrolling', async ({ page }) => {
  await scrollElTo(page, '[data-xp-row]:nth-of-type(3)', 0.5);
  await page.waitForTimeout(3500);
  let c = await comp(page);
  expect(c.riding).toBe(true);
  expect(c.width).toBe(64);
  expect(c.transitionProperty).toBe('width, opacity'); // no transform easing: the per-frame write IS the motion

  const check = async () => {
    c = await comp(page);
    const ds = await dots(page);
    const feet = c.top + c.width * 52 / 44;
    expect(Math.abs(c.left + c.width / 2 - ds[0].x)).toBeLessThan(0.6);
    expect(Math.min(...ds.map((d) => Math.abs(d.y - 16 - feet)))).toBeLessThan(1);
  };
  await check();
  await page.evaluate(() => window.scrollBy({ top: 40, behavior: 'instant' }));
  await page.waitForTimeout(50);
  await check();
});

test('catch-up: jumping past the timeline opens every row at once', async ({ page }) => {
  await scrollElTo(page, '#impact', 0);
  await expect.poll(() => openCount(page), { timeout: 400 }).toBe(5);
  const opens = await page.evaluate(() => window.__opens.map((o) => o.t));
  expect(Math.max(...opens) - Math.min(...opens)).toBeLessThan(100);
});

test('walk back: scrolling up walks the companion back up the line; rows stay open', async ({ page }) => {
  await scrollElTo(page, '#impact', 0);
  await expect.poll(() => openCount(page)).toBe(5);
  await scrollElTo(page, '[data-xp-row]:nth-of-type(2)', 0.5);
  await page.waitForTimeout(1300);
  const c = await comp(page);
  const ds = await dots(page);
  expect(c.riding).toBe(true);
  expect(Math.abs(ds[1].y - 16 - (c.top + c.width * 52 / 44))).toBeLessThan(1);
  expect(await openCount(page)).toBe(5);
});

test('visibility: hidden exactly when no dock is in view and it is not riding', async ({ page }) => {
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max; y += 250) {
    await scrollToY(page, y);
    await page.waitForTimeout(150);
    const s = await page.evaluate(() => {
      const anyDock = [...document.querySelectorAll('[data-dock]')].some((d) => {
        const r = d.getBoundingClientRect();
        return r.bottom >= 0 && r.top <= innerHeight;
      });
      const c = window.__comp();
      return { anyDock, hidden: c.hidden, riding: c.riding };
    });
    expect(s.hidden, `y=${y}`).toBe(!s.riding && !s.anyDock);
  }
});

test('scroll cue loops; anchor links scroll smoothly', async ({ page }) => {
  expect(await css(page.getByText('scroll ↓'), ['animation-duration', 'animation-iteration-count', 'animation-timing-function']))
    .toEqual({ 'animation-duration': '2.6s', 'animation-iteration-count': 'infinite', 'animation-timing-function': EASE_OUT });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');

  const target = await page.evaluate(() => document.getElementById('experience')!.getBoundingClientRect().top + scrollY);
  await page.locator('header nav a[href="#experience"]').click();
  await page.waitForTimeout(120);
  const midway = await page.evaluate(() => scrollY);
  expect(midway).toBeGreaterThan(0);
  expect(midway).toBeLessThan(target - 5);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 2000 }).toBeGreaterThan(target - 2);
});

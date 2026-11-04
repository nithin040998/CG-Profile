/* REDUCED MOTION — every module resolves to its final state (H decision 10);
   the robot stays present and keeps its expression, only losing its loops. */
import { test, expect, css, nums, expr, comp, mouseAway, scrollElTo, scrollToY, ORANGE_LO } from './fixtures';

test.use({ reducedMotion: 'reduce' });

test('everything is already in its final state — no scrolling, no waiting', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__comp().placed);

  const states = await page.evaluate(() => {
    const pick = (sel: string) => [...document.querySelectorAll(sel)].map((e) => {
      const cs = getComputedStyle(e);
      return `${cs.opacity}|${cs.transform}|${cs.animationName}`;
    });
    return {
      reveals: pick('[data-reveal="up"], [data-reveal="stagger"] > *'),
      rows: pick('[data-xp-row], [data-xp-row] > * > *'),
      hero: pick('#top h1, #top > div p'),
    };
  });
  for (const group of Object.values(states)) expect(new Set(group)).toEqual(new Set(['1|none|none']));

  expect(await page.locator('[data-xp-row][data-open]').count()).toBe(0);
  expect((await css(page.locator('[data-xp-row]').first().locator('..').locator(':scope > div').first(), ['display'])).display).toBe('none');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect((await comp(page)).transitionDuration).toBe('0s');

  // the robot: present, static, eyes open
  const robot = await page.evaluate(() => {
    const svg = document.querySelector('#companion svg')!;
    const a = (sel: string) => getComputedStyle(svg.querySelector(sel)!).animationName;
    return { idle: a(':scope > g > g'), sway: a(':scope > g > g > g > g'), lid: a('rect[width="11"]'),
      lidT: getComputedStyle(svg.querySelector('rect[width="11"]')!).transform };
  });
  expect(robot).toEqual({ idle: 'none', sway: 'none', lid: 'none', lidT: 'matrix(1, 0, 0, 1, 0, -10)' });
});

test('hover colour still changes — instantly', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('#top a', { hasText: 'view experience' });
  expect((await css(btn, ['transition-duration']))['transition-duration']).toBe('0s');
  await btn.hover();
  await page.waitForTimeout(30);
  expect((await css(btn, ['background-color']))['background-color']).toBe(ORANGE_LO);
});

test('the companion only docks: no glance, no gaze, never rides, never jolts', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__comp().placed);
  await page.waitForTimeout(1200);
  expect(await expr(page)).toBe('neutral'); // the 700ms glance is skipped

  await page.mouse.move(1430, 300);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() =>
    [...document.querySelectorAll<SVGElement>('#companion [data-pupil]')].map((p) => p.style.transform))).toEqual(['', '']);

  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max; y += 300) {
    await scrollToY(page, y);
    await page.waitForTimeout(60);
    expect((await comp(page)).riding, `y=${y}`).toBe(false);
  }

  await scrollElTo(page, '#impact', 0);
  await expect.poll(() => expr(page)).toBe('surprised');
  expect((await css(page.locator('#companion svg > g'), ['animation-name']))['animation-name']).toBe('none');
  await page.waitForTimeout(1800);
  expect(await expr(page)).toBe('surprised'); // no surprise → thinking sequence
});

test('with gaze off, the curious head tilt (−6°) is visible', async ({ page }) => {
  await page.goto('/');
  await scrollElTo(page, '#about', 0);
  await expect.poll(() => expr(page)).toBe('content');
  await page.locator('#about [data-reveal="stagger"] > *').first().hover();
  await expect.poll(() => expr(page)).toBe('curious');
  const tilt = await page.evaluate(() => (document.querySelector('#companion svg > g > g > g') as SVGElement).style.transform);
  expect(nums(tilt)).toEqual([-6]);
  await mouseAway(page);
});

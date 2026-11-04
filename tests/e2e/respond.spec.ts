/* RESPOND — answering the reader. src/motion/respond/* + companion reactions */
import {
  test, expect, css, nums, expr, comp, settle, mouseAway, scrollElTo, scrollToY,
  EASE_OUT, ORANGE, ORANGE_LO, ORANGE_TEXT, INK, HAIR, CREAM,
} from './fixtures';

const MUTED = 'rgb(107, 100, 90)';
const TRANSITION = {
  'transition-property': 'background-color, border-color, color',
  'transition-duration': '0.2s, 0.12s, 0.12s',
  'transition-timing-function': `${EASE_OUT}, ${EASE_OUT}, ${EASE_OUT}`,
};

test.describe('hover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await settle(page);
  });

  test('buttons: colour-only on the shared transition list — never a transform', async ({ page }) => {
    const cases = [
      [page.locator('#top a', { hasText: 'view experience' }), 'background-color', ORANGE, ORANGE_LO],
      [page.locator('#top a', { hasText: 'download résumé' }), 'background-color', INK, 'rgb(0, 0, 0)'],
      [page.locator('header').getByRole('link', { name: 'résumé', exact: true }), 'border-top-color', HAIR, ORANGE],
    ] as const;
    for (const [btn, prop, rest, hover] of cases) {
      expect(await css(btn, Object.keys(TRANSITION))).toEqual(TRANSITION);
      expect((await css(btn, [prop]))[prop]).toBe(rest);
      await btn.hover();
      await page.waitForTimeout(260);
      expect(await css(btn, [prop, 'transform'])).toEqual({ [prop]: hover, transform: 'none' });
      await mouseAway(page);
      await page.waitForTimeout(260);
      expect((await css(btn, [prop]))[prop]).toBe(rest);
    }
  });

  test('tiles: hairline warms (.4 light, .5 dark) — the stagger reveal no longer kills it', async ({ page }) => {
    const cases = [
      ['#about', '#about [data-reveal="stagger"] > *', HAIR, 'rgba(242, 103, 58, 0.4)'],
      ['#impact', '#impact [data-reveal="stagger"] > *', 'rgba(232, 223, 208, 0.14)', 'rgba(242, 103, 58, 0.5)'],
    ] as const;
    for (const [section, sel, rest, hover] of cases) {
      await scrollElTo(page, section, 0);
      await page.waitForTimeout(900);
      const tile = page.locator(sel).first();
      expect(await css(tile, ['transition-property', 'transition-duration']))
        .toEqual({ 'transition-property': TRANSITION['transition-property'], 'transition-duration': TRANSITION['transition-duration'] });
      expect((await css(tile, ['border-top-color']))['border-top-color']).toBe(rest);
      await tile.hover();
      await page.waitForTimeout(200);
      expect(await css(tile, ['border-top-color', 'transform'])).toEqual({ 'border-top-color': hover, transform: 'none' });
      await mouseAway(page);
    }
  });

  test('chips: hairline + ink together (both survive composition)', async ({ page }) => {
    await scrollElTo(page, '[data-xp-row]', 0.5);
    await expect(page.locator('[data-xp-row]').first()).toHaveAttribute('data-open', '', { timeout: 3000 });
    await page.waitForTimeout(800);
    const chip = page.locator('[data-xp-row]').first().locator('span', { hasText: 'golang' });
    expect(await css(chip, ['border-top-color', 'color'])).toEqual({ 'border-top-color': HAIR, color: MUTED });
    await chip.hover();
    await page.waitForTimeout(200);
    expect(await css(chip, ['border-top-color', 'color', 'transform']))
      .toEqual({ 'border-top-color': ORANGE, color: INK, transform: 'none' });
  });

  test('nav links: ink lift + a 1px underline that grows from the left', async ({ page }) => {
    const link = page.locator('header nav a', { hasText: 'experience' });
    expect((await css(link, ['color'])).color).toBe(MUTED);
    expect(await css(link, ['transform', 'transition-duration', 'background-color', 'height'], '::after'))
      .toEqual({ transform: 'matrix(0, 0, 0, 1, 0, 0)', 'transition-duration': '0.12s', 'background-color': ORANGE, height: '1px' });
    expect((await css(link, ['transform-origin'], '::after'))['transform-origin']).toMatch(/^0px /);
    await link.hover();
    await page.waitForTimeout(200);
    expect((await css(link, ['color'])).color).toBe(INK);
    expect((await css(link, ['transform'], '::after')).transform).toBe('none'); // scaleX(1) = identity
  });

  test('wordmark: the dot tints on hover', async ({ page }) => {
    const wm = page.locator('header a[href="#top"]');
    const dot = wm.locator('svg > path');
    expect(await css(dot, ['fill', 'transition-duration'])).toEqual({ fill: ORANGE, 'transition-duration': '0.2s' });
    await wm.hover();
    await page.waitForTimeout(260);
    expect((await css(dot, ['fill'])).fill).toBe(ORANGE_LO);
  });

  test('contact rows: the row washes and its key warms to orange-text', async ({ page }) => {
    await scrollElTo(page, '#contact', 0);
    await page.waitForTimeout(800);
    const row = page.locator('#contact a[href^="tel:"]');
    const key = row.locator('span').first();
    expect((await css(row, ['background-color', 'transition-duration'])))
      .toEqual({ 'background-color': 'rgba(0, 0, 0, 0)', 'transition-duration': '0.12s, 0.12s, 0.12s' });
    expect((await css(key, ['color'])).color).toBe(MUTED);
    await row.hover();
    await page.waitForTimeout(200);
    expect((await css(row, ['background-color']))['background-color']).toBe(CREAM);
    expect((await css(key, ['color'])).color).toBe(ORANGE_TEXT);
  });
});

test.describe('scroll state', () => {
  test('nav: transparent over the hero, frosted cream past it', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header');
    await expect(nav).not.toHaveAttribute('data-stuck');
    expect((await css(nav, ['background-color']))['background-color']).toBe('rgba(0, 0, 0, 0)');
    await scrollToY(page, 1200);
    await expect(nav).toHaveAttribute('data-stuck', '');
    await page.waitForTimeout(260);
    expect(await css(nav, ['background-color', 'border-bottom-color', 'backdrop-filter', 'transition-duration'])).toEqual({
      'background-color': 'rgba(248, 239, 222, 0.88)',
      'border-bottom-color': HAIR,
      'backdrop-filter': 'blur(8px) saturate(1.1)',
      'transition-duration': '0.2s, 0.2s',
    });
    await scrollToY(page, 0);
    await expect(nav).not.toHaveAttribute('data-stuck');
  });

  test('nav: the active-section dot follows the reader', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'experience', 'impact', 'contact']) {
      await scrollElTo(page, `#${id}`, 0.3);
      const link = page.locator(`header nav a[href="#${id}"]`);
      await expect(link).toHaveAttribute('aria-current', 'location');
      await expect(page.locator('header nav a[aria-current]')).toHaveCount(1);
      expect(await css(link, ['content', 'background-color', 'width'], '::before'))
        .toEqual({ content: '""', 'background-color': ORANGE, width: '6px' });
    }
  });
});

test('focus: keyboard focus draws the 2px orange-text ring', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveAttribute('href', '#top');
  expect(await css(focused, ['outline-style', 'outline-width', 'outline-color', 'outline-offset']))
    .toEqual({ 'outline-style': 'solid', 'outline-width': '2px', 'outline-color': ORANGE_TEXT, 'outline-offset': '2px' });
});

test('gaze: pupils ≤1.25px, mouth 0.4×, head 5° — page-wide, reset when the cursor leaves', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const read = () => page.evaluate(() => {
    const svg = document.querySelector('#companion svg')!;
    const mouth = [...svg.querySelectorAll('path')].find((p) => /^M1[789]\.\d 3[45]\.\d q/.test(p.getAttribute('d') || ''));
    return {
      pupils: [...svg.querySelectorAll<SVGElement>('[data-pupil]')].map((p) => p.style.transform),
      mouth: (mouth?.parentNode as SVGElement | null)?.style.transform ?? '',
      tilt: (svg.querySelector(':scope > g > g > g') as SVGElement).style.transform,
    };
  });
  const c = await comp(page);
  const cy = c.top + c.height / 2;

  await page.mouse.move(1430, cy);
  await page.waitForTimeout(120);
  let g = await read();
  expect(g.pupils).toHaveLength(2);
  const [px] = nums(g.pupils[0]);
  expect(px).toBeGreaterThan(0);
  expect(px).toBeLessThanOrEqual(1.25);
  expect(nums(g.mouth)[0]).toBeCloseTo(px * 0.4, 1);
  expect(nums(g.tilt)[0]).toBeCloseTo(px * 4, 1);

  // far left: beyond reach, so the vector clamps to the unit circle
  await page.mouse.move(8, cy);
  await page.waitForTimeout(120);
  g = await read();
  expect(nums(g.pupils[0])[0]).toBeCloseTo(-1.25, 1);
  expect(nums(g.tilt)[0]).toBeCloseTo(-5, 1);

  await page.evaluate(() => document.documentElement.dispatchEvent(new MouseEvent('mouseleave')));
  g = await read();
  expect(g).toEqual({ pupils: ['', ''], mouth: '', tilt: '' });
});

test.describe('companion reactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await settle(page);
  });

  test('curious while a tile is hovered, then back to the dock', async ({ page }) => {
    await scrollElTo(page, '#about', 0);
    await expect.poll(() => expr(page)).toBe('content');
    await page.locator('#about [data-reveal="stagger"] > *').first().hover();
    await expect.poll(() => expr(page), { timeout: 400 }).toBe('curious');
    await mouseAway(page);
    await expect.poll(() => expr(page), { timeout: 600 }).toBe('content');
  });

  test('wordmark → a 1.2s wink that survives its own scroll to the top', async ({ page }) => {
    await scrollElTo(page, '#about', 0);
    await expect.poll(() => expr(page)).toBe('content');
    await page.locator('header a[href="#top"]').click();
    await expect.poll(() => expr(page), { timeout: 300 }).toBe('wink');
    await page.waitForTimeout(800); // the smooth scroll to #top runs meanwhile
    expect(await expr(page)).toBe('wink');
    await expect.poll(() => expr(page), { timeout: 1200 }).toBe('neutral');
    expect(await page.evaluate(() => scrollY)).toBeLessThan(100);
  });

  test('résumé → happy + a nod, held 1.5s', async ({ page }) => {
    await scrollElTo(page, '#about', 0);
    await expect.poll(() => expr(page)).toBe('content');
    await page.locator('header').getByRole('link', { name: 'résumé', exact: true }).click();
    await expect.poll(() => expr(page), { timeout: 300 }).toBe('happy');
    expect((await css(page.locator('#companion svg > g'), ['animation-duration'])) ['animation-duration']).toBe('0.7s');
    await page.waitForTimeout(1000);
    expect(await expr(page)).toBe('happy');
    await expect.poll(() => expr(page), { timeout: 1500 }).toBe('neutral');
  });

  test('impact dock: surprised + jolt, then thinking ~1.3s later with a striking cream bolt', async ({ page }) => {
    await scrollElTo(page, '#impact', 0);
    await expect.poll(() => expr(page), { timeout: 2000 }).toBe('surprised');
    const t0 = Date.now();
    expect((await css(page.locator('#companion svg > g'), ['animation-duration']))['animation-duration']).toBe('0.62s');
    await expect.poll(() => expr(page), { timeout: 2500, intervals: [40] }).toBe('thinking');
    expect(Date.now() - t0).toBeGreaterThan(1000);
    expect(Date.now() - t0).toBeLessThan(1700);
    expect((await comp(page)).surface).toBe('dark');
    const bolt = page.locator('#companion svg path[d^="M23.6 -9.4"]');
    expect(await css(bolt, ['fill', 'animation-duration', 'animation-iteration-count', 'animation-timing-function']))
      .toEqual({ fill: 'rgb(246, 231, 206)', 'animation-duration': '2.8s', 'animation-iteration-count': 'infinite', 'animation-timing-function': 'linear' });

    // a stat tile still makes it curious; leaving hands the face back (surprise replays)
    await page.locator('#impact [data-reveal="stagger"] > *').first().hover();
    await expect.poll(() => expr(page), { timeout: 400 }).toBe('curious');
    await mouseAway(page);
    await expect.poll(() => expr(page), { timeout: 600 }).toBe('surprised');
  });

  test('60s without input → resting; any scroll wakes it', async ({ page }) => {
    test.setTimeout(100_000);
    await page.waitForTimeout(61_000);
    expect(await expr(page)).toBe('resting');
    await page.evaluate(() => window.scrollBy({ top: 4, behavior: 'instant' }));
    await expect.poll(() => expr(page), { timeout: 600 }).toBe('neutral');
  });
});

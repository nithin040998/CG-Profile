/* REVEAL — content arriving, once. src/motion/reveal/* */
import { test, expect, css, settle, scrollElTo, scrollToY, EASE_OUT, ORANGE, HAIR } from './fixtures';

test('hero load: five beats, 420ms ease-out, held forwards, ending visible', async ({ page }) => {
  await page.goto('/');
  const beats = [
    [page.getByText('engineering manager · bengaluru'), '0s'],
    [page.locator('#top h1'), '0s'],
    [page.getByText('Engineering manager who builds'), '0.26s'],
    [page.getByText('5+ yrs').locator('..'), '0.38s'],
    [page.locator('#top a', { hasText: 'view experience' }).locator('..'), '0.46s'],
  ] as const;
  for (const [el, delay] of beats) {
    expect(await css(el, ['animation-duration', 'animation-delay', 'animation-timing-function', 'animation-fill-mode']))
      .toEqual({
        'animation-duration': '0.42s',
        'animation-delay': delay,
        'animation-timing-function': EASE_OUT,
        'animation-fill-mode': 'forwards',
      });
  }
  await page.waitForTimeout(1100);
  for (const [el] of beats) expect(await css(el, ['opacity', 'transform'])).toEqual({ opacity: '1', transform: 'none' });
});

test('scroll reveal: hidden, then rises 14px + fades over 340ms once 15% is in view; fires once', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const sel = '#contact [data-reveal="up"]';
  const el = page.locator(sel).first();
  expect(await css(el, ['opacity', 'transform'])).toEqual({ opacity: '0', transform: 'matrix(1, 0, 0, 1, 0, 14)' });

  // top at 95% of the viewport sits inside the -10% bottom margin: not yet
  await scrollElTo(page, sel, 0.95);
  await page.waitForTimeout(400);
  await expect(el).not.toHaveAttribute('data-revealed');

  await scrollElTo(page, sel, 0.6);
  await expect(el).toHaveAttribute('data-revealed', '');
  expect(await css(el, ['animation-duration', 'animation-timing-function']))
    .toEqual({ 'animation-duration': '0.34s', 'animation-timing-function': EASE_OUT });
  await page.waitForTimeout(500);
  expect(await css(el, ['opacity', 'transform'])).toEqual({ opacity: '1', transform: 'none' });

  // fires once — leaving and coming back never re-hides it
  await scrollToY(page, 0);
  await page.waitForTimeout(300);
  await scrollElTo(page, sel, 0.6);
  await page.waitForTimeout(60);
  expect(await css(el, ['opacity'])).toEqual({ opacity: '1' });
});

test('stagger: children offset 60ms apart, capped at index 4', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const groups = [
    ['#about [data-reveal="stagger"]', ['0s', '0.06s', '0.12s']],
    ['#impact [data-reveal="stagger"]', ['0s', '0.06s', '0.12s', '0.18s', '0.24s', '0.24s']],
  ] as const;
  for (const [sel, want] of groups) {
    await scrollElTo(page, sel, 0.4);
    await expect(page.locator(sel)).toHaveAttribute('data-revealed', '');
    const delays = await page.locator(`${sel} > *`).evaluateAll((els) => els.map((e) => getComputedStyle(e).animationDelay));
    expect(delays).toEqual(want);
  }
  await page.waitForTimeout(700);
  const ops = await page.locator('[data-reveal="stagger"] > *').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(new Set(ops)).toEqual(new Set(['1']));
});

test('experience rows: hidden until dealt; 420ms row + cell cascade; the spine dot fills', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const rows = page.locator('[data-xp-row]');
  expect(await rows.evaluateAll((rs) => rs.map((r) => getComputedStyle(r).opacity))).toEqual(['0', '0', '0', '0', '0']);

  await scrollElTo(page, '[data-xp-row]', 0.5);
  const row = rows.first();
  await expect(row).toHaveAttribute('data-open', '', { timeout: 3000 });
  expect(await css(row, ['animation-duration', 'animation-timing-function']))
    .toEqual({ 'animation-duration': '0.42s', 'animation-timing-function': EASE_OUT });
  const cells = await row.evaluate((r) =>
    [...r.children].map((col) => [...col.children].map((c) => getComputedStyle(c).animationDelay)));
  expect(cells).toEqual([['0.06s', '0.12s'], ['0.09s', '0.14s', '0.19s', '0.24s']]);

  await page.waitForTimeout(800);
  expect(await css(row, ['opacity', 'transform'])).toEqual({ opacity: '1', transform: 'none' });
  expect(await css(row.locator('[data-spine-anchor]'), ['background-color', 'transition-duration'], '::after'))
    .toEqual({ 'background-color': ORANGE, 'transition-duration': '0.34s' });
  // a row the companion has not reached keeps a hairline dot
  expect(await css(rows.last().locator('[data-spine-anchor]'), ['background-color'], '::after'))
    .toEqual({ 'background-color': HAIR });
});

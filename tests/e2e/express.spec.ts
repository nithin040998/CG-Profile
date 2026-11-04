/* EXPRESS — the robot's character. src/motion/express/* */
import { test, expect, css, expr, settle, mouseAway, scrollElTo, EASE_BREATH, EASE_MORPH, EASE_SPRING } from './fixtures';

const SVG = '#companion svg';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await settle(page);
});

test('idle loops: breathe 5.6s · blink 5.2s · sway 6.8s, infinite, each anchored to its own box', async ({ page }) => {
  const anim = ['animation-duration', 'animation-timing-function', 'animation-iteration-count'];
  expect(await css(page.locator(`${SVG} > g > g`), [...anim, 'transform-box']))
    .toEqual({ 'animation-duration': '5.6s', 'animation-timing-function': EASE_BREATH, 'animation-iteration-count': 'infinite', 'transform-box': 'fill-box' });
  const lids = page.locator(`${SVG} rect[width="11"]`);
  await expect(lids).toHaveCount(2);
  expect(await css(lids.first(), anim))
    .toEqual({ 'animation-duration': '5.2s', 'animation-timing-function': 'ease-in-out', 'animation-iteration-count': 'infinite' });
  expect(await css(page.locator(`${SVG} > g > g > g > g`).first(), anim))
    .toEqual({ 'animation-duration': '6.8s', 'animation-timing-function': 'ease-in-out', 'animation-iteration-count': 'infinite' });
});

test('in-between motion: mouth d 420ms morph · pupils 160ms · mouth drift 200ms · head 500ms spring', async ({ page }) => {
  const t = ['transition-property', 'transition-duration', 'transition-timing-function'];
  const mouth = page.locator(`${SVG} path[d^="M18.0 34.9"]`);
  expect(await css(mouth, t)).toEqual({ 'transition-property': 'd', 'transition-duration': '0.42s', 'transition-timing-function': EASE_MORPH });
  expect(await css(page.locator(`${SVG} [data-pupil]`).first(), t))
    .toEqual({ 'transition-property': 'transform', 'transition-duration': '0.16s', 'transition-timing-function': 'ease-out' });
  expect(await css(mouth.locator('..'), t))
    .toEqual({ 'transition-property': 'transform', 'transition-duration': '0.2s', 'transition-timing-function': 'ease-out' });
  expect(await css(page.locator(`${SVG} > g > g > g`), t))
    .toEqual({ 'transition-property': 'transform', 'transition-duration': '0.5s', 'transition-timing-function': EASE_SPRING });
});

test('the mouth genuinely morphs: same <path> element, interpolated curve mid-flight', async ({ page }) => {
  await scrollElTo(page, '#about', 0);
  await expect.poll(() => expr(page)).toBe('content');
  const mouth = await page.locator(`${SVG} path[d^="M17.6 34.7"]`).elementHandle();
  const d = () => mouth!.evaluate((p) => getComputedStyle(p).getPropertyValue('d'));
  const start = await d();

  await page.locator('#about [data-reveal="stagger"] > *').first().hover();
  await expect.poll(() => expr(page), { timeout: 300, intervals: [20] }).toBe('curious');
  await page.waitForTimeout(100);
  const mid = await d();
  expect(await mouth!.evaluate((p) => p.isConnected && p.getAttribute('d'))).toBe('M18.6 34.8 q3.4 1.7 6.8 .3');
  await page.waitForTimeout(600);
  const end = await d();
  expect(mid).not.toBe(start);
  expect(mid).not.toBe(end);
  // Chrome reports an interpolated path in absolute form: q3.4 1.7 6.8 .3 from (18.6, 34.8)
  expect(end).toBe('path("M 18.6 34.8 Q 22 36.5 25.4 35.1")');
  await mouseAway(page);
});

test('gestures play once and clean up after their duration', async ({ page }) => {
  const outer = page.locator(`${SVG} > g`);
  expect((await css(outer, ['animation-name']))['animation-name']).toBe('none');
  await page.locator('header').getByRole('link', { name: 'résumé', exact: true }).click();
  const playing = await css(outer, ['animation-name', 'animation-duration']);
  expect(playing['animation-name']).not.toBe('none');
  expect(playing['animation-duration']).toBe('0.7s');
  await page.waitForTimeout(900);
  expect((await css(outer, ['animation-name']))['animation-name']).toBe('none');
});

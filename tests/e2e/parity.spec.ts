/* PARITY — the port must move exactly like the approved prototype
   (design/assets/landing.html). Same walk on both, compared checkpoint by
   checkpoint: companion position + size, rows opened, scroll offset. */
import { test, expect, scrollElTo } from './fixtures';
import type { Page } from '@playwright/test';
import { APP_URL, PROTO_URL } from '../../playwright.config';

interface Snap { name: string; x: number; y: number; w: number; open: string; scroll: number }

async function walk(page: Page, url: string): Promise<Snap[]> {
  await page.goto(url);
  await page.waitForTimeout(3500);
  const out: Snap[] = [];
  const snap = async (name: string) => {
    // let the descent finish, then make both re-pick from settled boxes: the
    // prototype measured docks mid-reveal (14px low) until the next scroll
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
    await page.waitForTimeout(1100);
    const s = await page.evaluate(() => {
      const c = window.__comp();
      const [x = 0, y = 0] = (c.transform.match(/-?\d+(\.\d+)?/g) ?? []).map(Number).slice(1);
      return {
        x, y, w: c.width,
        open: [...document.querySelectorAll('[data-xp-row], .xp-row')]
          .map((r) => +(r.hasAttribute('data-open') || r.classList.contains('is-open'))).join(''),
        scroll: Math.round(scrollY),
      };
    });
    out.push({ name, ...s });
  };
  await snap('hero');
  await scrollElTo(page, '#about', 0);
  await page.waitForTimeout(1600);
  await snap('about');
  for (let k = 0; k < 6; k++) {
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }));
    await page.waitForTimeout(900);
  }
  await snap('experience walk');
  await scrollElTo(page, '#impact', 0);
  await page.waitForTimeout(1800);
  await snap('impact');
  await scrollElTo(page, '#contact', 0);
  await page.waitForTimeout(1600);
  await snap('contact');
  return out;
}

for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]] as const) {
  test(`${label}: the companion moves exactly like the prototype`, async ({ browser }) => {
    test.setTimeout(90_000);
    const ctx = await browser.newContext({ viewport });
    const run = async (url: string) => {
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__comp = () => {
          const c = document.getElementById('companion')!;
          const r = c.getBoundingClientRect();
          return { width: r.width, transform: c.style.transform } as ReturnType<typeof window.__comp>;
        };
      });
      const snaps = await walk(page, url);
      await page.close();
      return snaps;
    };
    const port = await run(`${APP_URL}/`);
    const proto = await run(PROTO_URL);
    for (const [i, p] of port.entries()) {
      const q = proto[i];
      expect(p.scroll, p.name).toBe(q.scroll);
      expect(p.open, p.name).toBe(q.open);
      expect(Math.abs(p.x - q.x), `${p.name} x`).toBeLessThan(0.5);
      expect(Math.abs(p.y - q.y), `${p.name} y`).toBeLessThan(0.5);
      expect(Math.abs(p.w - q.w), `${p.name} w`).toBeLessThan(0.5);
    }
    await ctx.close();
  });
}

import { test as base, expect, type Locator, type Page } from '@playwright/test';

/* ══════════════════════════════════════════════════════════════════════
   Shared probes. Installed as an init script so they exist before the page's
   own scripts run, on the port AND on the prototype — both render the same
   robot SVG and use #companion, so every probe reads both.
   ══════════════════════════════════════════════════════════════════════ */

declare global {
  interface Window {
    __expr(): string;
    __comp(): CompanionState;
    __opens: { i: number; t: number }[];
    __exprLog: { t: number; e: string }[];
    __startExprLog(): void;
  }
}

export interface CompanionState {
  left: number; top: number; width: number; height: number;
  opacity: number; hidden: boolean; riding: boolean; placed: boolean;
  surface: string | undefined; transform: string;
  transitionProperty: string; transitionDuration: string; transitionTiming: string;
}

function installProbes() {
  const ROW = '[data-xp-row], .xp-row';

  /* which expression the face shows — read from the SVG itself (eye shapes +
     mouth curve), so it is implementation-agnostic */
  window.__expr = () => {
    const svg = document.querySelector('#companion svg');
    if (!svg) return 'none';
    const has = (sel: string) => !!svg.querySelector(sel);
    if (has('ellipse')) return 'surprised';
    const mouth = [...svg.querySelectorAll('path')]
      .map((p) => p.getAttribute('d') || '')
      .find((d) => /^M1[789]\.\d 3[45]\.\d q/.test(d));
    const closedL = has('path[d="M11.9 23.7 h7.6"]');
    const closedR = has('path[d="M24.9 23.7 h7.6"]');
    switch (mouth) {
      case 'M18.6 34.8 q3.4 1.7 6.8 .3': return 'curious';
      case 'M18.6 34.9 q3.4 0.7 6.8 0': return 'thinking';
      case 'M18.2 34.9 q3.8 0.8 7.6 0': return has('circle[r="5.2"]') ? 'alert' : 'focused';
      case 'M17.9 35.8 q4.2 -2.4 8.4 0': return 'sad';
      case 'M17.6 34.7 q4.4 2.2 8.8 0': return closedL && closedR ? 'content' : closedL ? 'wink' : 'happy';
      case 'M18.0 34.9 q4.0 0.9 8.0 0':
        return closedL && closedR ? 'resting' : has('circle[cx="17.3"]') ? 'looking' : 'neutral';
      default: return 'unknown';
    }
  };

  window.__comp = () => {
    const c = document.getElementById('companion')!;
    const r = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    return {
      left: r.left, top: r.top, width: r.width, height: r.height,
      opacity: +cs.opacity,
      hidden: c.hasAttribute('data-hidden') || c.classList.contains('is-hidden'),
      riding: c.dataset.mode === 'riding' || c.classList.contains('is-riding'),
      placed: c.hasAttribute('data-placed') || c.classList.contains('is-placed'),
      surface: c.dataset.surface,
      transform: c.style.transform,
      transitionProperty: cs.transitionProperty,
      transitionDuration: cs.transitionDuration,
      transitionTiming: cs.transitionTimingFunction,
    };
  };

  /* when each experience row opened */
  window.__opens = [];
  document.addEventListener('DOMContentLoaded', () => {
    const rows = [...document.querySelectorAll(ROW)];
    new MutationObserver((muts) => {
      for (const m of muts) {
        const el = m.target as Element;
        const i = rows.indexOf(el);
        if (i < 0 || window.__opens.some((o) => o.i === i)) continue;
        if (el.hasAttribute('data-open') || el.classList.contains('is-open')) {
          window.__opens.push({ i, t: performance.now() });
        }
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-open', 'class'] });
  });

  /* expression timeline, sampled every 40ms */
  window.__exprLog = [];
  window.__startExprLog = () => {
    setInterval(() => window.__exprLog.push({ t: performance.now(), e: window.__expr() }), 40);
  };
}

export const test = base.extend<{ consoleLog: string[] }>({
  page: async ({ page }, use) => {
    await page.addInitScript(installProbes);
    await use(page);
  },
  consoleLog: async ({ page }, use) => {
    const log: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') log.push(`${m.type()}: ${m.text()} @ ${m.location().url}`);
    });
    page.on('pageerror', (e) => log.push(`pageerror: ${e.message}`));
    await use(log);
  },
});

export { expect };

/* ── helpers ── */

export const expr = (page: Page) => page.evaluate(() => window.__expr());
export const comp = (page: Page) => page.evaluate(() => window.__comp());

/** wait until the companion is placed and the hero glance (700ms → +1600ms) is over */
export async function settle(page: Page) {
  await page.waitForFunction(() => window.__comp().placed);
  await page.waitForTimeout(2600);
}

/** instant scroll (bypasses the CSS smooth scroll) */
export const scrollToY = (page: Page, y: number) =>
  page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);

/** instant scroll so `selector` sits with its top at `frac` of the viewport */
export const scrollElTo = (page: Page, selector: string, frac = 0) =>
  page.evaluate(([sel, f]) => {
    const el = document.querySelector(sel as string)!;
    const top = el.getBoundingClientRect().top + scrollY - innerHeight * (f as number);
    window.scrollTo({ top, behavior: 'instant' });
  }, [selector, frac] as const);

/** computed style properties of the first match */
export const styleOf = (page: Page, selector: string, props: string[], pseudo?: string) =>
  page.evaluate(([sel, ps, pe]) => {
    const el = document.querySelector(sel as string);
    if (!el) return null;
    const cs = getComputedStyle(el, (pe as string) || undefined);
    return Object.fromEntries((ps as string[]).map((p) => [p, cs.getPropertyValue(p)]));
  }, [selector, props, pseudo ?? ''] as const);

/** computed style of a locator's element (optionally a pseudo-element) */
export const css = (l: Locator, props: string[], pseudo?: string) =>
  l.evaluate((el, [ps, pe]) => {
    const cs = getComputedStyle(el, pe || undefined);
    // an animation held at `transform:none` reports the identity matrix — same thing
    const val = (p: string) => {
      const v = cs.getPropertyValue(p);
      return p === 'transform' && v === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : v;
    };
    return Object.fromEntries(ps.map((p) => [p, val(p)])) as Record<string, string>;
  }, [props, pseudo ?? ''] as const);

/** parse "translate(1.2px, -0.4px)" / "rotate(-5deg)" into numbers */
export const nums = (s: string) => (s.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

/** move the mouse somewhere that hovers nothing (the left page margin) */
export const mouseAway = (page: Page) => page.mouse.move(4, 500);

export const ORANGE = 'rgb(242, 103, 58)';
export const ORANGE_LO = 'rgb(232, 90, 44)';
export const ORANGE_TEXT = 'rgb(184, 63, 24)';
export const INK = 'rgb(28, 26, 23)';
export const HAIR = 'rgba(28, 26, 23, 0.13)';
export const CREAM = 'rgb(248, 239, 222)';
export const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
export const EASE_MORPH = 'cubic-bezier(0.3, 0.7, 0.2, 1)';
export const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const EASE_BREATH = 'cubic-bezier(0.4, 0, 0.5, 1)';

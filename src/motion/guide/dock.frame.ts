/* GUIDE · frame — which dock the companion belongs in right now. */
import { restingRect } from './rest';

export type Surface = 'light' | 'dark';

export interface DockEntry<E extends string = string> {
  /** the dock's laid-out box IS the slot — read live, never restated */
  el: HTMLElement;
  /** the expression the companion wears here */
  expr: E;
  /** the surface the dock sits on — the bolt inverts on dark */
  surface?: Surface;
}

/** The on-screen dock whose centre is nearest the viewport midline. */
export function nearestDock<E extends string>(
  docks: Iterable<DockEntry<E>>,
  vh: number = innerHeight,
): { dock: DockEntry<E>; rect: DOMRect } | null {
  let best: { dock: DockEntry<E>; rect: DOMRect } | null = null;
  let bestD = Infinity;
  for (const dock of docks) {
    const rect = restingRect(dock.el);
    if (rect.bottom < 0 || rect.top > vh) continue;
    const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
    if (dist < bestD) {
      bestD = dist;
      best = { dock, rect };
    }
  }
  return best;
}

/* RESPOND · state — the companion reacting to what the reader does.
   Declared on the page with data attributes (server components can emit
   them), handled by ONE set of delegated listeners. */
import { isExpression, type ExpressionName } from '@/components/robot/expressions';
import type { GestureName } from '@/motion/express/gesture';

interface Hold {
  expr: ExpressionName;
  gesture?: GestureName;
  /** ms before the face is handed back to wherever the companion is */
  hold: number;
}

export type HoldName = 'wink' | 'cheer';

export const HOLDS: Record<HoldName, Hold> = {
  /** wordmark — the easter egg */
  wink: { expr: 'wink', hold: 1200 },
  /** résumé — a happy nod */
  cheer: { expr: 'happy', gesture: 'nod', hold: 1500 },
};

const isHold = (v: unknown): v is HoldName => typeof v === 'string' && v in HOLDS;

/** Spread on an element: the companion wears `expr` while the pointer is over it. */
export const companionHover = (expr: ExpressionName) => ({ 'data-companion-hover': expr });

/** Spread on a clickable element: the companion plays a held reaction. */
export const companionClick = (name: HoldName) => ({ 'data-companion-click': name });

export function bindReactions(on: {
  hover(expr: ExpressionName | null): void;
  hold(name: HoldName): void;
}): () => void {
  let hovered: HTMLElement | null = null;
  const host = (t: EventTarget | null, attr: string) =>
    t instanceof Element ? t.closest<HTMLElement>(`[${attr}]`) : null;

  // mouseover bubbles where mouseenter does not, so one listener covers every
  // tile; it fires on every element boundary, hence the same-host early out
  const onOver = (e: MouseEvent) => {
    const h = host(e.target, 'data-companion-hover');
    if (h === hovered) return;
    hovered = h;
    const expr = h?.dataset.companionHover;
    on.hover(isExpression(expr) ? expr : null);
  };
  // leaving the window from inside a hover host
  const onOut = (e: MouseEvent) => {
    if (e.relatedTarget || !hovered) return;
    hovered = null;
    on.hover(null);
  };
  const onClick = (e: MouseEvent) => {
    const name = host(e.target, 'data-companion-click')?.dataset.companionClick;
    if (isHold(name)) on.hold(name);
  };

  document.addEventListener('mouseover', onOver, { passive: true });
  document.addEventListener('mouseout', onOut, { passive: true });
  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    document.removeEventListener('click', onClick);
  };
}

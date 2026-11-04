import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import load from './load.keyframes.module.css';
import scroll from './scroll.keyframes.module.css';
import cascade from './cascade.keyframes.module.css';
import spineDot from './spine-dot.transition.module.css';

export type LoadStep = 1 | 2 | 3 | 4 | 5;

/** Hero load sequence — the className for beat `step`. */
export const loadIn = (step: LoadStep, className?: string): string =>
  cx(load.load, load[`s${step}`], className);

export type RevealKind = 'up' | 'stagger';

/** Props for a one-shot viewport reveal. Spread onto the element:
    `<div {...reveal('up', s.rail)}>`. RevealObserver finds it by data-reveal. */
export const reveal = (kind: RevealKind, className?: string) => ({
  className: cx(scroll[kind], className),
  'data-reveal': kind,
});

/** Stagger position for a child of a `stagger` reveal (H: capped at 4). */
export const staggerIndex = (i: number): CSSProperties =>
  ({ '--i': Math.min(i, 4) }) as CSSProperties;

/** Class hooks for the experience row cascade. */
export const cascadeClass = {
  track: cascade.track,
  row: cascade.row,
  dot: spineDot.dot,
};

/** Without JS nothing would ever reveal, so a <noscript> lifts every hidden
    entrance to its final state. A portfolio that hides its content behind a
    script is broken, not progressive. */
export const NO_SCRIPT_CSS =
  '[data-reveal="up"],[data-reveal="stagger"]>*,[data-xp-row],[data-xp-row]>*>*' +
  '{opacity:1!important;transform:none!important;animation:none!important}';

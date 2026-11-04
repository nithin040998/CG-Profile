/* GUIDE · frame — paint the spine trail up to the descent's current point. */
import { clamp01 } from '../tokens';
import type { SpinePoint } from './descent.frame';

export function paintTrail(
  trail: HTMLElement,
  wrap: HTMLElement,
  first: SpinePoint,
  last: SpinePoint,
  /** the descent's live position, document space */
  y: number,
): void {
  const span = last.y - first.y;
  if (span <= 0) return;
  const wr = wrap.getBoundingClientRect();
  trail.style.left = `${first.x - wr.left}px`;
  trail.style.top = `${first.y - (wr.top + scrollY)}px`;
  trail.style.height = `${span}px`;
  trail.style.transform = `scaleY(${clamp01((y - first.y) / span).toFixed(4)})`;
}

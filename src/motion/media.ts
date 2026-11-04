/* Media conditions every motion module agrees on. */

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** G: pointer-driven motion is pointer-only — touch has no cursor, and a
    robot frozen mid-gaze on a phone reads as broken. */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/** G: the md breakpoint. The spine geometry genuinely changes below it. */
export const NARROW_MAX = 1023;
export const isNarrow = (): boolean => innerWidth <= NARROW_MAX;

/** Read a px custom property off :root — read, don't restate, the CSS. */
export function cssPx(name: string, fallback: number): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;
}

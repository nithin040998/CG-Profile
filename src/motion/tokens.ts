/* JS mirror of the H motion tokens, for motion whose form is `frame` — values
   computed per rAF tick cannot read a CSS cubic-bezier, so the curve lives here.
   Keep in step with styles/tokens.css. */

/** The descent walk: settle into the dot, never slam into it. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

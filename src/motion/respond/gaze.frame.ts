/* ══════════════════════════════════════════════════════════════════════
   RESPOND · frame · trigger: pointer — PAGE-WIDE GAZE

   The library's own `follow` binds mousemove to the robot's box, so the eyes
   only track while the cursor is literally over the robot — a tiny target
   that makes it look dead everywhere else. This binds to the WINDOW and aims
   from the robot's live centre to the cursor, so it watches you across the
   whole page. Runs as a task on the shared frame loop (H perf rule).

   Callers gate it: pointer-only (FINE_POINTER) and not under reduced motion.
   ══════════════════════════════════════════════════════════════════════ */
import type { FrameLoop } from '../frame-loop';

export interface Gazer {
  /** dx, dy in −1..1 */
  gaze(dx: number, dy: number): void;
  resetGaze(): void;
}

/* Normalise against a generous radius rather than the robot's own half-width:
   scaling by its box would peg the pupils the instant the cursor left the
   sprite. ~46% of the viewport diagonal eases across the page and only maxes
   out at the far corners. */
const REACH = 0.46;

export function bindPageGaze(opts: {
  loop: FrameLoop;
  /** the element whose centre the gaze is measured from */
  el: HTMLElement;
  gazer: () => Gazer | null;
}): () => void {
  const { loop, el, gazer } = opts;
  let mx: number | null = null;
  let my: number | null = null;

  const unregister = loop.add('gaze', () => {
    const g = gazer();
    if (!g || mx === null || my === null) return;
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const reach = Math.hypot(innerWidth, innerHeight) * REACH;
    g.gaze((mx - cx) / reach, (my - cy) / reach);
  });

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
    loop.schedule('gaze');
  };
  // the robot moves under a still cursor while you scroll, so re-aim then too
  const onScroll = () => loop.schedule('gaze');
  // cursor leaves the window entirely -> look forward again
  const onLeave = () => {
    mx = my = null;
    gazer()?.resetGaze();
  };

  const root = document.documentElement;
  addEventListener('mousemove', onMove, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('mouseleave', onLeave);

  return () => {
    unregister();
    removeEventListener('mousemove', onMove);
    removeEventListener('scroll', onScroll);
    root.removeEventListener('mouseleave', onLeave);
  };
}

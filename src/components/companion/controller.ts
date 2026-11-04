/* ══════════════════════════════════════════════════════════════════════
   THE COMPANION CONTROLLER

   ONE robot for the entire page. It never unmounts (it lives in the root
   layout), so it reads as a character travelling with the reader rather
   than five copies of a decoration. Two behaviours:

     DOCKING — each section has an invisible <Dock>. The companion glides to
               whichever dock is in view and wears that dock's expression.
     RIDING  — inside the experience timeline it sits ON the spine and walks
               dot-to-dot (motion/guide/descent.frame.ts), wearing each
               role's expression as it arrives.

   Positioning is transform-only, written from one frame loop (H perf rule).
   This file wires motion modules together; the motion itself lives in
   motion/guide (glide, descent, trail) and motion/respond (gaze).
   ══════════════════════════════════════════════════════════════════════ */
import { createFrameLoop } from '@/motion/frame-loop';
import { createDescent, type Descent, type DescentHooks } from '@/motion/guide/descent.frame';
import { nearestDock, type Surface } from '@/motion/guide/dock.frame';
import { paintTrail } from '@/motion/guide/trail.frame';
import { bindPageGaze } from '@/motion/respond/gaze.frame';
import { FINE_POINTER, REDUCED_MOTION, isNarrow } from '@/motion/media';
import { ASPECT, isExpression, type ExpressionName } from '@/components/robot/expressions';
import type { RobotHandle } from '@/components/robot/Robot';
import { HOLDS, bindReactions, type HoldName } from './reactions';
import type { CompanionRegistry, TimelineEntry } from './registry';

/* The head's bottom edge as a fraction of the wrap height: the viewBox is
   '0 -11 44 56' and the head ends at y=41, so (41+11)/56. The mascot stands
   ON the dot, so this is the offset that puts its feet there rather than its
   centre — centring on the dot made it look like it was floating through
   the text. */
const HEAD_B = 52 / 56;

/* Clearance above the dot. MEASURED, not eyeballed: the spine sits in the
   24px col3/col4 gutter but the head is 50px at size 64, so centred on the
   line it necessarily bleeds ~13px into the text column each side. The
   clearance therefore comes from the vertical: park it in the 96px gap ABOVE
   the row's dot. Narrow puts the spine flush left with the text 20px to its
   right and the bot at 40px, so the head already clears the text there.
   RECALIBRATED for resting dots (motion/guide/rest.ts). The prototype's
   34 / 12 were tuned while it measured each dot 18px low (the row still
   mid-deal), so what was actually seen — and approved — is 16 / −6. These
   values reproduce that look exactly, now in both scroll directions (the
   prototype's walk-back used true dots and sat 18px higher). */
const clearance = () => (isNarrow() ? -6 : 16);
const botSize = () => (isNarrow() ? 40 : 64);

/** how long without input before the companion falls asleep */
const IDLE_AFTER = 60_000;
const IDLE_EVENTS = ['mousemove', 'scroll', 'keydown', 'touchstart'] as const;

const ROW_HOOKS: DescentHooks = {
  anchorOf: (row) => row.querySelector<HTMLElement>('[data-spine-anchor]') ?? row,
  open: (row) => row.setAttribute('data-open', ''),
  isOpen: (row) => row.hasAttribute('data-open'),
};

interface Target {
  x: number;
  y: number;
  w: number;
  expr: ExpressionName;
  riding: boolean;
  surface: Surface;
  note?: string;
}

export interface CompanionController {
  /** the registry changed (a dock or the timeline mounted / unmounted) */
  refresh(): void;
  destroy(): void;
}

export function createCompanionController(
  el: HTMLElement,
  robot: () => RobotHandle | null,
  registry: CompanionRegistry,
): CompanionController {
  const reduced = matchMedia(REDUCED_MOTION).matches;
  const loop = createFrameLoop();
  const timers = new Set<number>();
  let alive = true;

  let timeline: TimelineEntry | null = null;
  let descent: Descent | null = null;
  let target: Target | null = null;
  let placed = false;
  let curExpr: ExpressionName | null = null;
  /* A reaction the reader caused outranks the expression the scroll position
     implies. Without this, the next paint re-wears the dock's expression: the
     wordmark's href="#top" and résumé's href="#" both scroll, so in the
     prototype the wink and the nod were overwritten one frame after the click. */
  let override: 'hover' | 'hold' | null = null;

  const schedule = () => {
    if (alive) loop.schedule('paint');
  };
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  /* (Re)arm the descent when the timeline registers. Reduced motion never
     arms it: the rows are simply visible and the companion only docks. */
  function syncTimeline() {
    const next = registry.timeline();
    if (next === timeline) return;
    timeline = next;
    descent = timeline && timeline.rows.length && !reduced
      ? createDescent(timeline.rows, ROW_HOOKS)
      : null;
  }

  /* Set the expression only when it actually changes — a new expression
     re-renders the face, so calling it every frame would thrash. */
  function wear(expr: ExpressionName, note?: string) {
    if (expr === curExpr) return;
    const b = robot();
    if (!b) return;
    curExpr = expr;
    if (expr === 'surprised' && !reduced) b.surprise('thinking', 1300);
    else b.setExpression(expr);
    if (note) el.dataset.note = note;
  }

  /* choose where the companion belongs right now */
  function pick() {
    const vh = innerHeight;

    // 1. Walking the spine? Active from the moment the timeline enters the
    //    viewport until its end scrolls past, so the descent owns the whole
    //    section rather than a band around the midline.
    const D = descent?.state;
    const xr = timeline?.wrap.getBoundingClientRect();
    if (descent && D && xr && xr.top < vh * 0.92 && xr.bottom > 0 && D.y !== null) {
      const size = botSize();
      const { rows } = descent;
      const anchor = descent.dotOf(rows[Math.max(0, Math.min(D.idx, rows.length - 1))]);
      const cur = rows[Math.max(0, D.idx)];
      const role = cur?.dataset.expr;
      // ON the line: the spine runs through the mascot's centre and it stands
      // ON the dot. D.y is document space, so subtracting scrollY each frame
      // is what keeps it glued to the line while the page moves under it.
      target = {
        x: anchor.x - size / 2,
        y: D.y - scrollY - size * ASPECT * HEAD_B - clearance(),
        w: size,
        // walking: eyes on the road · arrived: wear the role
        expr: D.phase === 'moving' ? 'focused' : isExpression(role) ? role : 'content',
        riding: true,
        surface: 'light',
        note: cur?.dataset.note,
      };
      return;
    }

    // 2. Otherwise dock to the nearest in-view dock. The dock's laid-out box
    //    IS the slot: fill its width and sit at its top. (Not centred: the
    //    robot is 44:56, and treating it as square is what once put the hero
    //    bot on top of the name.)
    const best = nearestDock(registry.docks(), vh);
    if (!best) {
      target = null;
      return;
    }
    target = {
      x: best.rect.left,
      y: best.rect.top,
      w: best.rect.width,
      expr: best.dock.expr,
      riding: false,
      surface: best.dock.surface ?? 'light',
    };
  }

  /* write the transform — one place, transform + width only */
  function paint(now: number) {
    descent?.advance(now);
    pick();

    if (descent && timeline?.trail && descent.state.y !== null) {
      const { rows } = descent;
      paintTrail(timeline.trail, timeline.wrap,
        descent.dotOf(rows[0]), descent.dotOf(rows[rows.length - 1]), descent.state.y);
    }

    el.toggleAttribute('data-hidden', !target);
    if (target) {
      el.dataset.mode = target.riding ? 'riding' : 'docked';
      el.dataset.surface = target.surface;
      el.style.setProperty('--cw', `${target.w}px`);
      // sub-pixel, not Math.round: rounding a value that changes by <1px per
      // frame quantises the walk into visible steps
      const transform = `translate3d(${target.x.toFixed(2)}px,${target.y.toFixed(2)}px,0)`;
      if (!placed) {
        // First placement lands without the glide — otherwise it would sweep
        // in from the top-left corner (its untransformed origin). The fade-in
        // still runs: data-placed is set after transitions are restored.
        el.style.transition = 'none';
        el.style.transform = transform;
        void el.offsetWidth;
        el.style.transition = '';
        el.setAttribute('data-placed', '');
        placed = true;
      } else {
        el.style.transform = transform;
      }
      if (!override) wear(target.expr, target.note);
    }

    // Keep the loop alive while the sequence still has work: a scroll event
    // can start the descent, but only a self-sustaining loop can animate it
    // after the wheel stops. Idle + nothing pending -> the loop parks itself.
    if (descent?.pending()) schedule();
  }

  /* ── reactions ── */
  function hover(expr: ExpressionName | null) {
    if (override === 'hold') return; // a click reaction finishes first
    override = expr ? 'hover' : null;
    curExpr = null;
    if (expr) wear(expr);
    else schedule();
  }
  function hold(name: HoldName) {
    const h = HOLDS[name];
    const b = robot();
    if (!b) return;
    override = 'hold';
    curExpr = h.expr;
    b.setExpression(h.expr);
    if (h.gesture) b.play(h.gesture);
    later(() => {
      override = null;
      curExpr = null;
      schedule();
    }, h.hold);
  }

  /* hero load sequence, final beat (H): at 700ms the robot glances at the name */
  const glance = () =>
    later(() => {
      const b = robot();
      if (!b || reduced) return;
      curExpr = 'looking';
      b.setExpression('looking');
      later(() => {
        curExpr = 'neutral';
        b.setExpression('neutral');
      }, 1600);
    }, 700);

  /* 60s with no input → resting */
  let idleTimer = 0;
  const resetIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      curExpr = 'resting';
      robot()?.setExpression('resting');
    }, IDLE_AFTER);
  };

  /* ── wire up ── */
  loop.add('paint', paint); // registered first: paint writes, then gaze reads the placed box
  const unbindGaze = matchMedia(FINE_POINTER).matches && !reduced
    ? bindPageGaze({ loop, el, gazer: robot })
    : () => {};
  const unbindReactions = bindReactions({ hover, hold });

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  // late layout shifts (font swap, images) move the docks without a scroll
  const ro = new ResizeObserver(schedule);
  ro.observe(document.body);
  if (document.readyState === 'complete') glance();
  else addEventListener('load', glance, { once: true });
  IDLE_EVENTS.forEach((ev) => addEventListener(ev, resetIdle, { passive: true }));
  resetIdle();

  syncTimeline();
  schedule();

  return {
    refresh() {
      syncTimeline();
      schedule();
    },
    destroy() {
      alive = false;
      loop.destroy();
      unbindGaze();
      unbindReactions();
      ro.disconnect();
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      removeEventListener('load', schedule);
      removeEventListener('load', glance);
      IDLE_EVENTS.forEach((ev) => removeEventListener(ev, resetIdle));
      clearTimeout(idleTimer);
      timers.forEach(clearTimeout);
      timers.clear();
    },
  };
}

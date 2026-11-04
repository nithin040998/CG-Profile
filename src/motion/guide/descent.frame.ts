/* ══════════════════════════════════════════════════════════════════════
   GUIDE · frame · trigger: sequence — THE DESCENT

   The mascot walks the spine, top to bottom, and each role opens only once
   it has arrived and its own animation has finished.

   Why a state machine and not scroll-position tracking: "row N opens after
   the mascot arrives" is a SEQUENCE, and a sequence has to own its own clock.
   If position is derived from scrollY every frame, the mascot teleports as
   fast as the wheel turns and there is no arrival to gate on.

   So the mascot's position is one animated value in DOCUMENT space (state.y —
   the point on the spine it is standing on), eased between dots per frame.
   Scroll does not drive it; scroll only decides how far down the timeline it
   is ALLOWED to have walked (the frontier). The caller converts document y
   to a viewport transform each frame, which is what keeps it glued to the
   line while the page scrolls, without scroll dictating the animation.
   ══════════════════════════════════════════════════════════════════════ */
import { easeInOutCubic } from '../tokens';
import { cssPx, isNarrow } from '../media';
import { restingRect } from './rest';

export const DESCENT = {
  /** a row unlocks when its dot passes this fraction of the viewport height */
  trigger: 0.66,
  /** how far above the first dot the mascot enters from */
  rise: 150,
  /** row open animation (420ms) + its longest stagger (240ms), with air */
  dwell: 720,
  /** leg duration when the reader is more than a row ahead of the parade */
  catchUp: 240,
} as const;

export type DescentPhase = 'idle' | 'moving' | 'opening';

export interface DescentState {
  /** index of the row the mascot has reached */
  idx: number;
  /** live position on the spine, document coords */
  y: number | null;
  /** the leg being walked */
  from: number;
  to: number;
  t0: number;
  dur: number;
  phase: DescentPhase;
  /** opening: when the row's own animation is done */
  until: number;
}

export interface SpinePoint {
  x: number;
  y: number;
}

export interface DescentHooks {
  /** the element whose box carries the row's spine dot */
  anchorOf(row: HTMLElement): HTMLElement;
  open(row: HTMLElement): void;
  isOpen(row: HTMLElement): boolean;
}

export function createDescent(rows: HTMLElement[], hooks: DescentHooks) {
  const D: DescentState = {
    idx: -1, y: null, from: 0, to: 0, t0: 0, dur: 0, phase: 'idle', until: 0,
  };

  /* Where a row's spine dot is, in document coords — at REST: a row not yet
     dealt is still translated 18px down. Narrow (<=1023) moves the spine
     flush-left and the dot to top:0, so the anchor differs per breakpoint. */
  function dotOf(row: HTMLElement): SpinePoint {
    const m = restingRect(hooks.anchorOf(row));
    return isNarrow()
      ? { y: m.top + scrollY + 4, x: m.left }
      : { y: m.top + scrollY + 11, x: m.left - cssPx('--gutter', 24) / 2 + 0.5 };
  }

  function openRow(i: number, now: number) {
    const r = rows[i];
    if (!r) return;
    hooks.open(r);
    D.phase = 'opening';
    D.until = now + DESCENT.dwell;
  }

  /** the last row the reader has scrolled far enough to unlock */
  function frontier(): number {
    let f = -1;
    for (let i = 0; i < rows.length; i++) {
      if (dotOf(rows[i]).y - scrollY <= innerHeight * DESCENT.trigger) f = i;
    }
    return f;
  }

  function advance(now: number) {
    const want = frontier();

    // Catch-up: any row already scrolled above the fold is opened outright. A
    // fast scroller (or an anchor jump) must never be shown blank rows waiting
    // on a 700ms-per-step parade they scrolled straight past.
    for (let i = 0; i < rows.length; i++) {
      if (hooks.isOpen(rows[i])) continue;
      if (dotOf(rows[i]).y - scrollY < 0) {
        hooks.open(rows[i]);
        if (i > D.idx) {
          D.idx = i;
          D.y = dotOf(rows[i]).y;
          D.phase = 'idle';
        }
      }
    }

    if (D.phase === 'opening') {
      if (now < D.until) return;
      D.phase = 'idle';
    }

    if (D.phase === 'moving') {
      const t = Math.min(1, (now - D.t0) / D.dur);
      D.y = D.from + (D.to - D.from) * easeInOutCubic(t);
      if (t >= 1) {
        D.y = D.to;
        if (D.idx < want) {
          D.idx++;
          openRow(D.idx, now);
        } else D.phase = 'idle';
      }
      return;
    }

    // idle: step toward the frontier, one row at a time
    if (want > D.idx) {
      const next = dotOf(rows[D.idx + 1]);
      if (D.y === null) D.y = next.y - DESCENT.rise; // first entry: drop in from above
      // Behind by more than a row means the reader is moving faster than the
      // parade — close the gap quickly instead of making them wait on it.
      const behind = want - D.idx;
      const dist = Math.abs(next.y - D.y);
      D.from = D.y;
      D.to = next.y;
      D.t0 = now;
      D.dur = behind > 1 ? DESCENT.catchUp : Math.max(420, Math.min(900, dist * 1.1));
      D.phase = 'moving';
    } else if (want < D.idx && want >= 0 && D.y !== null) {
      // Scrolled back up: walk back up the line. Rows stay open once opened —
      // re-hiding read history the reader has already seen is hostile.
      const back = dotOf(rows[want]);
      D.from = D.y;
      D.to = back.y;
      D.t0 = now;
      D.dur = Math.max(360, Math.min(760, Math.abs(back.y - D.y) * 0.9));
      D.idx = want;
      D.phase = 'moving';
    }
  }

  return {
    state: D as Readonly<DescentState>,
    rows,
    dotOf,
    advance,
    /** true while the sequence still has work and the loop must stay alive */
    pending: () => D.phase !== 'idle' || frontier() > D.idx,
  };
}

export type Descent = ReturnType<typeof createDescent>;

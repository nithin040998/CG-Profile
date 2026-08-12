# The Companion — one robot, whole page

*Locked 2026-08-11 at CG's direction: "instead of multiple bot instances animate the same bot
across sections with each expression — and in experience place it on the timeline line and
animate each experience and bot expressions based on it."*

This **supersedes** the "robot appears exactly 5 times" decision in
[I-wireframes.md](../I-wireframes.md) (decision #9) and the multi-instance placement in
[ROBOT-LIB.md](ROBOT-LIB.md).

## The idea

There is **exactly one** robot instance on the page. It never unmounts. It travels between
sections and changes expression to react to whatever you are reading.

Five separate instances read as *wallpaper* — the same decoration repeated. One instance that
follows you reads as a *character who is watching along*. That is the difference between a
motif and a mascot, and it is the whole reason the robot exists (Phase A: the robot carries the
warmth so the layout can stay disciplined).

## Two modes

### 1. Docking — sections
Each section has an invisible anchor (`.dock`) that holds layout space. The controller finds
whichever dock is nearest the viewport midline, glides the companion there, and applies that
dock's `data-expr`.

| Dock | Size | Expression | Where |
|---|---|---|---|
| `#dock-hero` | `clamp(128,12.2vw,176)` | `neutral` → `looking` at 700ms | right of the name, in the hero pocket |
| `#dock-about` | 96px | `content` | the about left rail |
| `#dock-impact` | 120px | `surprised` → `thinking` | beside "The numbers." on dark |
| `#dock-foot` | 96px | `content` | centred above the sign-off |

The glide is `transform` + `width` on `--t-glide` (900ms) with `--ease-morph` — slow enough to
read as travel rather than teleporting.

**A dock MUST have real height, and the size lives in CSS only.** Both halves of that were the
root cause of the mascot being misaligned in *every* section:

1. The docks were zero-height, but the controller centred the companion with
   `(r.height − w)/2` — which also assumed a square robot (it is **44:56**). At `height:0` that
   places it half a body *above* the slot the layout reserved: measured **120px off at 1440**,
   which is exactly why the hero robot sat on top of "Channakeshava" and the mobile one lay
   across the lead paragraph. Docks now carry `aspect-ratio:44/56` and the companion fills the
   dock's own box (`x:r.left, y:r.top`).
2. The `DOCKS` table hardcoded `w:240` for the hero while the CSS resolved to 132px on a phone —
   a second source of truth that silently disagreed, rendering the mascot ~1.8× its slot. Widths
   are now **read live** from the laid-out box. Read, don't restate.

**Optical alignment vs box alignment.** The viewBox `'0 -11 44 56'` reserves ~25–30px of the box
for antennas above the head, so aligning boxes reads as a much larger gap than the token
suggests. The about rail uses `--s-5` (not `--s-7`) so the *perceived* gap lands on 48px. The
impact dock's negative margin is capped at `--s-3`: the full ~30px correction pushed the antennas
through the dark section's top edge and clipped them, because the head is only the bottom 30/56
of the box.

### 2. The descent — the experience timeline
Inside `#experience` the companion **walks down the spine, top to bottom**, and each role opens
only once it has arrived *and* that row's own animation has finished. One role at a time, in
order.

**This is a state machine, not a scroll mapping — and that distinction is the feature.**
"Row N opens after the mascot arrives" is a *sequence*, and a sequence has to own its own clock.
The earlier implementation derived position from `scrollY` every frame, which means the mascot
teleports as fast as the wheel turns and there is no arrival to gate on. So:

- `D.y` — one animated value: the point on the spine it is standing on, in **document** space,
  eased between dots by rAF (easeInOutCubic, 420–900ms per leg, scaled by distance).
- **Scroll does not drive it.** Scroll only sets the *frontier*: how far down the timeline it is
  permitted to have walked (a row unlocks when its dot passes 66% of the viewport height).
- Converting `D.y − scrollY` to a transform each frame is what keeps it glued to the line while
  the page scrolls under it.
- The rAF loop self-sustains while `phase !== 'idle'` or the frontier is ahead, then parks. A
  scroll event can *start* the descent, but only a self-sustaining loop can animate it after the
  wheel stops.

**Escape hatches — a gated reveal can trap content, so it must never be the only path:**
- Rows already scrolled above the fold open outright. A fast scroller must never be shown blank
  rows waiting on a parade they scrolled straight past.
- More than one row behind → the walk shortens to 240ms instead of making them wait.
- Scrolling back up walks back up the line, but **never re-hides** an opened row.
- `.is-armed` is set by JS, so with no JS — or under `prefers-reduced-motion` — every row is
  simply visible. A portfolio that hides its work history behind a script is broken, not
  progressive. Verified: reduced-motion reports `armed:false, hiddenRows:0`; a JS-disabled
  capture shows all five roles readable.

| Row | Expression | Why |
|---|---|---|
| Evaluationz (current) | `looking` | actively watching the newest work |
| Hero MotoCorp | `focused` | the deepest systems work — 5M req/day |
| Spurtree | `curious` | dashboards, customer behaviour |
| Likemindz (founder) | `happy` | founded it; Y Combinator final round |
| Education | `content` | where it started |

**Position — ON the line, centred on the spine.** This reverses the earlier "beside the line,
never on it" rule at CG's direction. The original objection was real (centring covered the role
title), so it had to be solved rather than ignored:

- The spine sits in the **24px** col3/col4 gutter; the head is **50px** at size 64. So an
  on-spine mascot *necessarily* bleeds ~13px into the text column. **There is no width that is
  both "on the line" and clear of the column** — shrinking it enough to fit 24px would make it
  a speck.
- The clearance therefore comes from the **vertical**: it stands in the 96px gap **above** each
  row's dot, where that bleed lands on whitespace instead of letters.
- Clearance is breakpoint-split because the geometry genuinely differs: **34px desktop**
  (measured: title box was −10.3px at 18px of lift, now +3.5→+5.9px clear at 1440/1280/1024),
  **12px narrow** — on ≤1023px the spine is flush-left with the column 20px right of it, so at
  40px the head already clears the text horizontally by ~4.6px, and more lift would only push it
  into the row above.
- It stands **on** the dot (feet at the line's y, via a `52/56` head-bottom offset), not centred
  on it — centring made it look like it was floating through the text.

**The spine trail.** One `.spine-trail` element on `.xp` (not per row, so the fill is continuous
across the gaps between rows) grows via `scaleY` from the top as the descent advances, leaving an
orange line behind the mascot.

**Sub-pixel transforms, not `Math.round`.** Rounding a value that changes by <1px per frame
quantises the walk into visible steps.

## Implementation notes

- **`position:fixed` in both modes.** My first attempt used `position:absolute` while riding, to
  "scroll with" the timeline — but `#companion` is a child of `<body>`, so absolute resolved
  against the body, not `.xp`, and the robot sat 1300px off. Fixed + per-frame recompute is both
  simpler and correct.
- **One rAF loop**, one write site (`paint()`), scroll listener is `{passive:true}` — the H perf
  rule. Only `transform` and `width` are touched.
- **`setExpression` is guarded** by `curExpr`. It rebuilds the eye/mouth DOM, so calling it every
  frame would thrash; it fires only when the expression actually changes.
- **`pointer-events:none`** — the companion floats over content and must never block a click.
- **`aria-hidden="true"`** on the wrapper. It is decorative; it announces nothing.
- **Docks are `visibility:hidden`, not `display:none`** — they must keep their layout box, since
  the controller reads their rect to place the companion.
- **`#companion:not(.is-placed){opacity:0}`** so it never flashes at 0,0 before the first paint.

## Interactions kept

| Trigger | Behaviour |
|---|---|
| cursor move anywhere on the page | pupils + mouth + head track the cursor (see below) |
| hover a stat / through-line tile | `curious`, releases on mouseleave |
| click the wordmark | `wink` easter egg, 1.2s |
| click any résumé button | `happy` + nod, 1.5s |
| 60s idle | `resting` |

## Page-wide gaze

**`data-follow` is deliberately OFF.** The library binds its own mousemove to the robot's
*wrapper element* (`robot-lib.js:438-446`), so the eyes only track while the cursor is literally
over the sprite — a tiny target, which makes the robot look dead everywhere else on the page.

Gaze is driven from a **window-level** listener instead, computing the vector from the robot's
live centre to the cursor:

```js
const r = comp.getBoundingClientRect();
const cx = r.left + r.width/2, cy = r.top + r.height/2;
const reach = Math.hypot(innerWidth, innerHeight) * 0.46;
b.gaze((mx - cx)/reach, (my - cy)/reach);
```

**Why normalise against the viewport diagonal, not the robot's own box:** `api.gaze()` clamps its
input to a unit vector, so dividing by the sprite's half-width would peg the pupils the instant
the cursor left the robot — full deflection everywhere, which is the same dead feeling in the
opposite direction. ~46% of the viewport diagonal gives a gaze that *eases* across the canvas and
only maxes out near the far corners.

The library's `gaze()` moves three things together: pupils at full amplitude, the mouth group at
0.4× (the locked gaze-follow ratio from D-brand.md), and a slight head tilt from the x component.
That combination is what reads as *looking* rather than *eyes sliding around*.

Also handled:
- **`scroll` re-aims.** The robot travels under a stationary cursor as you scroll, so gaze is
  recomputed on scroll too — otherwise it holds a stale angle.
- **`document mouseleave` → `resetGaze()`.** Cursor leaves the window, robot looks forward again.
- **Shares the rAF pattern** — `mousemove` is `{passive:true}` and only queues a frame; the write
  happens once per frame in `paintGaze()`.

**Gated to `(hover:hover) and (pointer:fine)` and skipped under reduced motion.** Verified: on an
emulated iPhone the listener never attaches (`finePointer:false`, pupil transform `(none)`), and
under `prefers-reduced-motion:reduce` a mouse move produces no pupil transform.

## Reduced motion

Verified under `prefers-reduced-motion: reduce`:
- companion opacity **1** (present, not hidden), transition **0s** (snaps between docks)
- **0** animating robot parts — no breathe, blink, sway, bolt
- **0** stranded-invisible content blocks
- the hero `looking` glance is skipped, and `surprised` resolves straight to `thinking` without
  the jolt

The robot stays *present and static* rather than disappearing — a vanishing mascot reads as
broken; a still one reads as calm.

## React port (Phase J)

One `<Companion/>` mounted in the layout, outside the page content so route changes never
unmount it. The dock table becomes a config array; `pick()`/`paint()` become a single
`useEffect` with a rAF-throttled scroll handler. Sections declare their dock with a ref plus an
`expr` prop rather than `data-expr`.

Keep the guard on `setExpression` — in React it is doubly important, since a re-render must not
rebuild the SVG's inner DOM.

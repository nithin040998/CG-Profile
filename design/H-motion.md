# Phase H — Motion Language

*Written 2026-08-11. The robot's motion already exists and is authoritative —
`design/assets/robot-lib.css` holds every curve and duration in use. This phase does two things:
names those curves as tokens so the page can share them, and defines the **page-level** motion
(scroll reveal, smooth scroll, hover, page transition) that does not exist yet.*

The governing idea, from Phase A's tone words: **precise, warm, engineered, calm, confident.**
Calm is the operative one. Nothing on this site races, bounces gratuitously, or moves because it
can. Motion has exactly three jobs — reveal, respond, and express — and anything that does none
of them gets cut.

---

## The easing set

Extracted from `robot-lib.css`, now named. These six are the complete vocabulary; no ad-hoc
`cubic-bezier` anywhere else in the codebase.

| Token | Curve | Character | Where it is already used |
|---|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | decisive settle, no overshoot | scroll reveals (`robot-lib.css:195`) |
| `--ease-morph` | `cubic-bezier(.3,.7,.2,1)` | slow-in, long tail | mouth `d` morph (`:54`), travel (`:164`) |
| `--ease-breath` | `cubic-bezier(.4,0,.5,1)` | symmetric, organic | breathe (`:77`, `:86`) |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | one clean overshoot | pop (`:157`), tilt (`:169`) |
| `--ease-jolt` | `cubic-bezier(.3,1.5,.5,1)` | sharp overshoot, hard stop | jolt (`:148`) |
| `--ease-quake` | `cubic-bezier(.36,.07,.19,.97)` | fast, anxious | wobble (`:120`) |

**Which one to reach for:**
- Anything entering the viewport → `--ease-out`.
- Anything responding to a pointer → `--ease-out`, short duration.
- Anything the robot does → already handled by the library; don't re-specify.
- `--ease-spring` / `--ease-jolt` / `--ease-quake` are **robot-only**. UI never bounces. A card
  that springs on hover would break the "engineered" register instantly.

## The duration set

| Token | Value | Use |
|---|---|---|
| `--t-1` | `120ms` | pointer feedback: hairline colour, chip hover, focus ring |
| `--t-2` | `160ms` | pupil tracking (`:64`), small transforms |
| `--t-3` | `200ms` | mouth group (`:65`), button press |
| `--t-4` | `340ms` | scroll-reveal opacity + transform (`:195`) |
| `--t-5` | `420ms` | mouth `d` morph (`:54`), larger state changes |
| `--t-6` | `500ms` | travel / timeline spine (`:164`) |

**Ceiling: nothing UI-driven exceeds 500ms.** The only longer things on the page are the
*ambient loops* — breathe 5.6s, float 4.4s, blink 5.2s, sway 6.8s, bolt 2.8s — which are
continuous by design and never block a user action.

---

## Scroll reveal

The Locomotive-derived intent CG confirmed in Phase B: **calm reveals, nothing acrobatic.**

**One reveal, used everywhere:**

```css
.reveal{
  opacity:0; transform:translateY(14px);
  transition:opacity var(--t-4) var(--ease-out), transform var(--t-4) var(--ease-out);
}
.reveal.is-in{ opacity:1; transform:none }
```

- **14px of travel, not 40.** The distance is deliberately small. Long-travel reveals draw
  attention to the reveal; short ones draw attention to the content arriving.
- **Y only.** No scale, no rotation, no blur, no horizontal slide. One axis.
- **Trigger at 15% visible**, `rootMargin:'0px 0px -10% 0px'` — fires slightly before the
  element is comfortably in view so the content is already settled by the time the eye reaches it.
- **Fire once.** `observer.unobserve(el)` on entry. Elements that re-animate on scroll-up feel
  like a demo, and it is the single most common way this pattern goes wrong.

```js
const io = new IntersectionObserver((entries)=>{
  for (const e of entries){
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }
}, { threshold:.15, rootMargin:'0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
```

### Stagger
Groups (stat tiles, skill groups, timeline rows) stagger by **60ms per item, capped at 4 items
(240ms total)**. Past four the last item arrives late enough to feel broken.

```css
.reveal--stagger > *{ transition-delay:calc(var(--i,0) * 60ms) }
```

Set `--i` on the child in markup. Cap: items 5+ share `--i:4`.

### What does NOT get a reveal
- The hero. It is above the fold — it uses the **load** sequence below instead.
- Anything inside a still-hidden parent (nested reveals double-animate).
- The nav bar, the footer hairline, background surfaces.
- Body paragraphs *individually* — reveal the block, not each line. Per-line reveals make text
  unreadable while it arrives.

---

## The load sequence

The hero is the one choreographed moment on the site. Total budget **900ms**, and it must never
delay text paint — everything animates from an already-painted state (opacity/transform only, no
`display` toggles, no font-swap dependency; `next/font` is self-hosted so there is no FOUT to
hide).

| Order | Element | Delay | Duration | Curve |
|---|---|---|---|---|
| 1 | giant name (behind) | 0 | `--t-5` | `--ease-out` |
| 2 | robot fades + starts `breathe` | 120ms | `--t-5` | `--ease-out` |
| 3 | tagline, with the orange punchline word | 260ms | `--t-4` | `--ease-out` |
| 4 | eyebrow + meta row | 380ms | `--t-4` | `--ease-out` |
| 5 | CTA row | 460ms | `--t-4` | `--ease-out` |
| 6 | robot plays `looking` — glances at the name | 700ms | (library) | (library) |

Step 6 is the payoff and the reason the sequence exists: the robot arrives, settles, then *looks
at his name*. It reads as attention rather than animation. Per the placement map in
`ROBOT-LIB.md`, it returns to `neutral` after.

---

## Smooth scroll

CG confirmed the Locomotive smooth-scroll feel. **Implement it with the least machinery that
achieves it:**

```css
html{ scroll-behavior:smooth }
```

That covers anchor navigation, which is the only place the site actually needs eased scrolling.

**Do not add a scroll-hijacking library (Locomotive Scroll, Lenis) unless CG asks for it after
seeing the built page.** The trade is bad by default: it breaks native scrollbar position,
breaks `Cmd+F` scroll-into-view, breaks keyboard paging, adds ~15KB, and on a page this calm the
perceived difference is small. The *feel* CG liked in the reference came mostly from generous
spacing and slow reveals — which Phase G and the reveal above already deliver — not from
interpolated scroll position.

**Flagged as a decision to revisit at Phase K**, once there is a real page to compare against.

### Parallax
At most **one** parallaxed element: the hero's giant background name, moving at `0.15×` scroll
speed, and only while the hero is in view. Nothing else parallaxes. Implement with
`transform:translate3d()` inside a `requestAnimationFrame` read/write split — never by writing
`top` in a scroll handler.

---

## Hover & focus

| Target | Change | Timing |
|---|---|---|
| Nav link | `--ink-muted` → `--ink`; orange 1px underline grows from left | `--t-1` |
| Card / tile | hairline `--hair` → `rgba(242,103,58,.4)`; fill `--cream-2` → `--cream-2` (unchanged) | `--t-1` |
| Primary button | fill `--orange` → `--orange-lo`; **no lift, no scale** | `--t-3` |
| Secondary button | fill `--ink` → `#000`-ward by ~6% | `--t-3` |
| Metric tile | robot plays `curious` (per placement map) | (library) |
| Tech chip | hairline warms; text `--ink-muted` → `--ink` | `--t-1` |

**No transform on hover.** No `translateY(-2px)`, no `scale(1.02)`. Cards that lift are the house
style of every template portfolio; hairline-and-colour response is the TE/Daylight register and
is what keeps this page from looking generic. This is the single most important rule in this
phase.

### Focus — non-negotiable
```css
:focus-visible{ outline:2px solid var(--orange); outline-offset:2px; border-radius:var(--r-1) }
```
Never `outline:none` without a replacement. Orange at 2px on cream is a *non-text* UI indicator,
so it is judged against the 3:1 threshold — `--orange` on cream measures **2.71** (E-color.md)
and **fails** it. Therefore: on light surfaces the focus ring uses **`--orange-text` `#B83F18`**
(4.89, passes); on dark surfaces `--orange` `#F2673A` (5.93, passes). This is the same rule as
the text/fill split in E, applied to outlines.

---

## Page transitions

Route changes: **cross-fade only**, `--t-4` with `--ease-out`, no slide and no shared-element
flight. The site is short (one long page plus a possible `/404`), so elaborate transitions cost
more than they return. The robot persists across routes and does not re-mount — on `/404` it
switches to `sad` per the placement map.

---

## Reduced motion

`robot-lib.css:206-213` already kills every robot animation *and* transition under
`prefers-reduced-motion:reduce`. The page-level rules must join that block, not duplicate it.

Under reduced motion:
- reveals: elements start at their final state (`opacity:1; transform:none`) — **never left
  invisible**. This is the failure mode to guard: if the reveal class sets `opacity:0` and the
  reduced-motion block only disables the *transition*, content is permanently hidden. Set the
  final state explicitly.
- smooth scroll: `scroll-behavior:auto`.
- parallax: disabled — the rAF loop must check the media query and bail, since CSS cannot stop it.
- hover: colour changes stay (they are not motion), transitions become instant.
- the robot: still *present*, just static — it keeps its expression and loses its loops.

```css
@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto }
  .reveal{ opacity:1 !important; transform:none !important; transition:none !important }
  .reveal--stagger > *{ transition-delay:0ms !important }
}
```

---

## Performance rules

- **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`, `left`, `margin`,
  or `box-shadow` — each forces layout or paint on every frame.
- **No `will-change` left permanently on.** Add it before an interaction, remove it after. A
  standing `will-change:transform` on many nodes costs GPU memory continuously.
- **One rAF loop for the whole page** — parallax and cursor-follow share a single loop with a
  read phase then a write phase. Two independent loops both reading `scrollY` and writing
  transforms is how layout thrash gets introduced.
- **Cursor-follow is pointer-only** (`@media (hover:hover) and (pointer:fine)`, per G).

---

## Decisions locked

1. **Six named easings, six named durations** — the set extracted from `robot-lib.css`. No
   ad-hoc curves.
2. **Spring/jolt/quake curves are robot-only.** UI never bounces or overshoots.
3. **One reveal**: 14px Y-translate + fade, `--t-4`, `--ease-out`, threshold .15, fires once.
4. **Stagger 60ms, capped at 4 items.**
5. **No hover transforms anywhere** — hairline + colour response only. Rejected the standard
   card-lift because it is exactly what makes template portfolios look like templates.
6. **Native `scroll-behavior:smooth`, no scroll-hijacking library.** Rejected Locomotive/Lenis on
   the accessibility and weight trade; revisit at Phase K against the real page.
7. **One parallax element** (hero background name at 0.15×), nothing else.
8. **900ms hero load sequence** ending in the robot's `looking` glance at the name.
9. **Focus ring is `--orange-text` on light, `--orange` on dark** — because `--orange` on cream
   measures 2.71 and fails the 3:1 non-text threshold.
10. **Reveals must set their final state under reduced motion**, not merely disable the
    transition — otherwise content stays invisible.

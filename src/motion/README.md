# Motion

Every animation on the site lives in this folder. Components never define motion of their
own; they compose it from here.

Two axes organise it:

- **Style** is *what the motion is for*. That decides the **folder**. The first three are
  the jobs H-motion.md allows ("reveal, respond, express — anything that does none of them
  gets cut"). The fourth covers the companion's choreography, which came later (COMPANION.md).
- **Form** is *how the motion is built*. That decides the **filename suffix**, so
  `ls motion/**/*.keyframes.*` lists every keyframe animation.

| Style | Folder | Job |
|---|---|---|
| **reveal** | `reveal/` | Bring content in, once. |
| **respond** | `respond/` | Answer the reader's input: pointer, scroll position. |
| **express** | `express/` | Give the robot its character. |
| **guide** | `guide/` | Lead the reader through the page. |

| Form | Suffix | Built as | Use when |
|---|---|---|---|
| **keyframes** | `.keyframes.module.css` | CSS `@keyframes`, time-based | loops, and one-shot entrances |
| **transition** | `.transition.module.css` | CSS `transition` between two states, toggled by a class or attribute | state changes, hover |
| **frame** | `.frame.ts` (+ `.frame.module.css`) | JS, value computed every rAF tick on the shared loop | sequences, and motion that follows geometry or the pointer |
| **native** | `.native.css` | a browser feature | smooth anchor scrolling |

## Catalogue

| Animation | Style | Form | Trigger | Source |
|---|---|---|---|---|
| hero load sequence (5 beats) | reveal | keyframes | page load | `reveal/load.keyframes.module.css` |
| scroll reveal: rise + fade | reveal | keyframes | viewport | `reveal/scroll.keyframes.module.css` · `RevealObserver.tsx` |
| stagger (60ms, cap 4) | reveal | keyframes | viewport | `reveal/scroll.keyframes.module.css` |
| experience row deal + cell cascade | reveal | keyframes | sequence | `reveal/cascade.keyframes.module.css` |
| spine dot fill | reveal | transition | sequence | `reveal/spine-dot.transition.module.css` |
| button fill | respond | transition | hover | `respond/hover.transition.module.css` `.fill` |
| hairline warm (tiles, chips, button 3) | respond | transition | hover | `… .hairline` |
| ink lift (nav links, chips, contact keys) | respond | transition | hover | `… .ink` |
| row wash (contact) | respond | transition | hover | `… .wash` |
| nav underline grow | respond | transition | hover | `… .underline` |
| wordmark dot tint | respond | transition | hover | `… .tint` |
| nav turns opaque past the hero | respond | transition | scroll | `respond/stick.transition.module.css` |
| page-wide gaze | respond | frame | pointer | `respond/gaze.frame.ts` |
| reactions: curious on tiles, wink on the wordmark, nod on résumé, resting after 60s | respond | state | pointer / click / idle | `components/companion/reactions.ts` · `controller.ts` |
| breathe · breatheDeep · float | express | keyframes | loop | `express/idle.keyframes.module.css` |
| blink · blinkSlow · blinkDouble | express | keyframes | loop | `express/idle.keyframes.module.css` |
| antenna sway | express | keyframes | loop | `express/idle.keyframes.module.css` |
| thinking bolt strike | express | keyframes | loop (while thinking) | `express/idle.keyframes.module.css` |
| wobble · nod · shake · jolt · pop | express | keyframes | event | `express/gesture.keyframes.module.css` · `gesture.ts` |
| mouth morph | express | transition | expression change | `express/morph.transition.module.css` `.mouth` |
| pupil / mouth drift, head tilt, hover tilt | express | transition | gaze write / hover | `express/morph.transition.module.css` |
| smooth anchor scroll | guide | native | anchor click | `guide/smooth-scroll.native.css` |
| scroll cue | guide | keyframes | loop | `guide/cue.keyframes.module.css` |
| dock-to-dock glide, fade in/out | guide | transition | scroll | `guide/glide.transition.module.css` · `dock.frame.ts` |
| the descent (spine walk) | guide | frame | sequence | `guide/descent.frame.ts` |
| riding the spine | guide | frame | scroll | `components/companion/controller.ts` |
| spine trail | guide | frame | sequence | `guide/trail.frame.ts` · `trail.frame.module.css` |

## Rules

These are H-motion.md's locked decisions, as they apply to this code.

1. **Tokens only.** Use the six easings and six durations in `styles/tokens.css`, with no
   ad-hoc curves. JS-driven motion uses the mirrors in `tokens.ts`.
2. **Spring, jolt and quake are robot-only.** UI never overshoots.
3. **No transform on hover.** Hovers respond with hairline and colour only.
4. **`transition` belongs to respond.** Entrances are one-shot `@keyframes`, so a reveal can
   never overwrite a hover transition on the same element. In the prototype the stagger
   reveal did exactly that and silently removed the tiles' hover response. Every respond
   class composes the single `.respond` transition list for the same reason.
5. **One frame loop.** All `frame`-form motion registers on `frame-loop.ts` and never calls
   `requestAnimationFrame` itself.
6. **Animate transform and opacity.** Known exceptions carried over from the prototype: the
   companion's `width` ease and the trail's per-frame `top`/`height`.
7. **Reduced motion.** Each module carries its own `prefers-reduced-motion` block and sets
   the **final** state, never just "no transition", so content is never left invisible. The
   robot stays present and keeps its expression, and only loses its loops.
8. **Pointer motion is pointer-only.** It is gated on `FINE_POINTER` in `media.ts`.
9. **No JS, no hiding.** `NO_SCRIPT_CSS` (reveal/index.ts) lifts every entrance to its final
   state when scripts are off.
10. **Land on resting boxes.** Anything that measures a box in order to land on it must use
    `guide/rest.ts`. That covers the docks and the spine dots. A reveal is still 14px low
    mid-entrance and an undealt row is 18px low; the prototype measured both mid-entrance,
    so its companion settled 14–18px low.
11. **The reader's reactions outrank the scroll.** While a hover or click reaction is active,
    the scroll-driven expression waits (`override` in `components/companion/controller.ts`).
    The wordmark and résumé links scroll the page, and in the prototype that scroll
    overwrote the wink and the nod on the very next frame.

## Tests

`npm run test:e2e` runs the Playwright suite in `tests/e2e/`, organised by the same styles:
`reveal` · `respond` · `express` · `guide`, plus `reduced-motion`, `no-js`, `responsive`,
`parity` (a checkpoint-by-checkpoint comparison with `design/assets/landing.html`) and
`console`. It builds the app and serves it on 127.0.0.1:4330, serves the prototype on
:4331, and uses the installed Google Chrome.

## Adding an animation

1. Pick the style folder by job, and the form by how it is built.
2. Name the file `<name>.<form>.module.css` (or `.frame.ts`).
3. Add its reduced-motion block in the same file.
4. Add a row to the catalogue above.

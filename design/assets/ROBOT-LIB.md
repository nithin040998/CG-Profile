# CG Robot Library

Two files, zero dependencies:
- **`robot-lib.css`** — all animations + the mouth/colour contract
- **`robot-lib.js`** — expression geometry + the behaviour controller

Live demo: **`robot-showcase.html`** (open it — every section is interactive).

---

## Install

```html
<link rel="stylesheet" href="robot-lib.css">
<script src="robot-lib.js"></script>   <!-- auto-mounts [data-cg-robot] -->
```

## Declarative

```html
<div data-cg-robot
     data-size="40"                      <!-- px width -->
     data-expression="neutral"
     data-idle="breathe blink sway"      <!-- space-separated -->
     data-hover="curious tilt"           <!-- expression + behaviours -->
     data-hint="optional annotation text"
     data-follow="true"
     data-label="CG's assistant"         <!-- omit => aria-hidden -->
></div>
```

## Programmatic

```js
const bot = CGRobot.create({
  size: 150,
  expression: 'neutral',
  idle: ['breatheDeep', 'blink', 'sway'],
  follow: true,
  followTarget: heroSection,   // defaults to the robot's own wrapper
});
heroEl.append(bot.el);
```

---

## Expressions (12)

| Name | Eyes | Mouth | Intended use |
|---|---|---|---|
| `neutral` | round | content | default / idle |
| `happy` | round | warm | success, sign-off |
| `content` | closed | warm | resting warmly |
| `focused` | bars | tight | reading, scroll-active |
| `curious` | asym + −6° tilt | lopsided | hover, hint open |
| `thinking` | bars + bolt | small | processing |
| **`surprised`** | **wide** | **open `o`** | **new / unexpected / reveal** |
| `looking` | shifted right | content | points at adjacent content |
| `wink` | wink | warm | easter egg |
| `alert` | ring | tight | attention, notice |
| `resting` | closed | content | idle-long / asleep |
| `sad` | droop | down | 404, empty state |

**Only eyes and mouth ever change.** Head, antennas, ears and plate are constant — that is what
keeps it recognisably one character.

---

## Animations

### Idle (looping — compose freely)
| Name | What it does |
|---|---|
| **`breathe`** | **3.5% scale from the base, 5.6s — slow inhale/exhale** |
| **`breatheDeep`** | **5.5%, 5.2s — for hero sizes** |
| `float` | 2.5px vertical drift, 4.4s |
| `blink` | lid sweeps down from the top, 5.2s |
| `blinkSlow` | sleepy, 7.4s |
| `blinkDouble` | two quick blinks, 6s |
| `sway` | antennas only, 6.8s |

Default is `breathe blink sway`.

> **Why breathing works:** `transform-origin: 50% 100%` (base of the head) so it swells *upward*
> like a chest rising rather than pulsing like a balloon. The exhale is longer than the inhale
> (45% in / 55% out) — that asymmetry is what makes it read as breath.

### One-shot events
| Method | Duration | Use |
|---|---|---|
| `bot.wobble()` | 900ms | click, playful acknowledgement |
| `bot.nod()` | 700ms | agreement, success |
| `bot.shake()` | 500ms | error, "no" |
| **`bot.jolt()`** | **620ms** | **surprise pop with overshoot** |
| `bot.pop()` | 500ms | mount / reveal |

### Composites
| Method | What it does |
|---|---|
| **`bot.surprise(settleTo, ms)`** | wide eyes + `jolt`, settles back after 1.1s |
| `bot.think(bool)` | bolt on/off + `thinking` expression |
| `bot.showHint(bool)` | slide the hint bubble in/out |

### Interaction-driven
| Name | What it does |
|---|---|
| `follow` | pupils track cursor; mouth drifts at 40%; head rotates ≤5° |
| `tilt` | −8° springy tilt on hover |
| `bot.gaze(dx, dy)` | aim the eyes manually, −1..1 |
| `bot.lean(deg)` | scroll-velocity-linked tilt |

---

## The mouth contract — do not break this

- **One shade, always: `rgba(25,21,18,.42)`.** Never darkens, never fills, never ramps opacity.
  An early version wiped it on like a progress bar; that was wrong and was removed.
- **Always present.** The robot is never "smile off" — every expression carries a smile,
  it just curves more or less.
- **Interaction = curve morph only**, `.42s cubic-bezier(.3,.7,.2,1)`.
- **On dark backgrounds it does NOT invert.** It sits on the *orange face*, not the page.
  Only the **bolt** inverts (via `.cg-on-dark`), because it floats outside the head.
- **Small sizes:** thicken the stroke only — 1.6 → 1.8 → 2.1 → 2.5 → 2.9. Shade never changes.

## Transform anchors — the rule that breaks silently

**Every rotate/scale pivots from the centre of the face, except breathing and antenna sway
which pivot from their base.**

SVG defaults `transform-origin` to the **user-space origin (0,0) — the top-left corner**, not
the element's middle. Without an explicit anchor, `wobble`/`jolt`/`pop` swing and scale from the
corner like a hinged door. The library fixes this with:

```css
.cg-robot *{ transform-box:fill-box; }      /* % now resolves per-element bbox */
.cg-outer, .cg-tiltable, .cg-lean, .cg-travel{ transform-origin:50% 50%; }  /* centre */
.cg-idle, .cg-breathe, .cg-breathe-deep, .cg-antennas{ transform-origin:50% 100%; } /* base */
```

| Animation | Anchor | Why |
|---|---|---|
| `wobble`, `nod`, `jolt`, `pop`, hover `tilt`, cursor rotate | **50% 50%** | rotation/scale must feel like the head moving on its own axis |
| `breathe`, `breatheDeep` | 50% 100% | a chest rises *upward* from the base |
| `sway` (antennas) | 50% 100% | antennas bend from where they meet the head |
| `float`, `shake` | n/a | pure translation — anchor irrelevant |

> Verify with `_scratch/260810/anchor-test.html` — it overlays a crosshair on the true centre of
> each SVG box. A correctly-anchored animation keeps the face pinned to the intersection for the
> whole cycle. If the face drifts off the crosshair, an anchor regressed.

## Theming

Override the custom properties:
```css
:root{ --cg-orange:#F2673A; --cg-orange-hi:#F87A4B; --cg-orange-lo:#E85A2C;
       --cg-orange-dp:#C9481F; --cg-plate:#C9481F; --cg-mouth:rgba(25,21,18,.42); }
.cg-on-dark{ --cg-bolt:#F6E7CE; }   /* add to any dark container */
```

## Accessibility

- `aria-hidden="true"` by default (decorative). Pass `label` to expose it as an image.
- `prefers-reduced-motion: reduce` disables **every** animation and transition; lids resolve
  open, the bolt resolves simply present. No motion leaks through.

## Placement map

| Expression | Animation | Where |
|---|---|---|
| `neutral` | breathe + blink + sway | hero at rest; default |
| `looking` | gaze toward copy | hero — glances at the name on load |
| `curious` | tilt + hint | hover on metric tiles, role cards |
| `focused` | lean with scroll | experience timeline — rides the spine |
| `thinking` | bolt strike | skills / AI & automation |
| `surprised` | jolt | big-number reveals, first scroll into Impact |
| `happy` | nod | contact success, resume download |
| `content` | breathe slow | footer sign-off |
| `wink` | — | easter egg: click the wordmark |
| `alert` | shake | form validation error |
| `resting` | blinkSlow | after 60s idle |
| `sad` | — | 404 page |

## React port

Mechanical translation:
- `CGRobot.EXPRESSIONS` → the `expression` prop union
- `eyesMarkup()` → a `<Eyes kind={...}/>` sub-component
- controller methods → `useEffect` + event handlers, or `useImperativeHandle` for a ref API
- the SVG body moves into JSX unchanged; **same CSS file**

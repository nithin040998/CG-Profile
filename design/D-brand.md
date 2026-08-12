# Phase D — CG Brand Foundation

*The identity kit. Built on the Phase C art direction ("a well-made instrument in warm
afternoon light"). Everything here is type-driven and buildable in CSS/SVG — no heavy logo,
no illustration commissions.*

---

## D1 — Wordmark

**Primary (site identity, hero):** the full name, set large and confident.
```
Channakeshava Gowda
```
Set in the display sans, tight tracking, soft near-black ink. This is the hero backdrop type
(Surjith's move) — the name IS the graphic.

**Compact mark (nav, favicon, footer, meta):** `CG` — but treated as a *hardware plate*, not
a logo:

```
┌──────┐
│  CG  │   ← mono, tracked, hairline box (TE label plate)
└──────┘
```
- Mono type, uppercase `CG`, letter-spaced.
- Optional hairline 1px border box with tight padding — reads like a stamped device label.
- Sits top-left in the nav, small (≈12–13px), quiet.

**Signature / handle (contact + links):** `cg6.tech` and `CG6-Tech` used as-is for
domain/social — no restyling needed. `CG6` is the handle, not the primary identity.

**Naming flourish (borrowed from TE, adapted):** en-dash technical labels for roles/sections
where it earns its keep, e.g. `EM–02` style role indices in the timeline:
```
role–01   Evaluationz India        2026 → present
role–02   Hero MotoCorp            2024 → 2026
```
Use sparingly — it should feel like a catalog index, not a gimmick.

**Wordmark rules:**
- Never outline, gradient, skew, or shadow the name.
- The compact `CG` plate never appears larger than body-text scale.
- Orange is NOT used on the wordmark — the name stays ink. (Orange is reserved for signals;
  the identity stays sober.)

---

## D2 — The Robot: CG's second brain  ⟵ REVISED per user direction (2026-08-10)

> **User direction:** *"it should be very subtle, small — think of that robot like a second
> brain of CG, his assistant which knows everything about him. Give that robot subtle small
> hints type of interaction wherever it's required. Don't forfeit it."*

**What it is:** not a mascot statue — an **assistant**. A small, always-present machine that
knows CG's history and quietly annotates it. It is the second brain: CG writes the facts, the
robot adds the footnotes.

**Personality:** competent, dry, unobtrusive. It has read everything. It offers a small hint
only when a hint helps, then goes quiet. It never performs, never sells, never blocks content.

**Why it matters strategically:** (a) the robot is **orange**, which licenses orange as the
accent everywhere else — the accent is *earned* by the character, not applied on top
(Surjith's logic); (b) it turns a static résumé into something that feels *alive and
knowledgeable* without adding copy noise.

### Scale & presence — small everywhere
The robot is **never large**. Target size ≈ 28–56px in-flow (a little larger only in the
hero, and even there it is a *companion beside* the name, not a monument in front of it).
It reads as a small device sitting on the page, not an illustration.

### The hint interaction (the core mechanic)
A small robot sits in the margin / near a data point. On **hover or scroll-into-view**, a tiny
annotation eases in beside it — one short line, mono, muted, orange eye-dot leading.

```
        ┌────────────────────────────────────────────┐
 (•▮)   │ ● 3,000+ concurrent websocket connections. │
  ╱╲    │   that's the whole Bengaluru charger fleet. │
        └────────────────────────────────────────────┘
   ↑ small robot          ↑ hint: appears on hover/in-view, disappears after
```

**Hint rules:**
- **One line, maybe two.** Never a paragraph. Mono, small, muted ink, orange eye-dot.
- **Additive, never load-bearing.** Every hint is removable with zero loss of meaning — the
  résumé must read completely without them (a11y + skimming requirement).
- **One hint visible at a time.** They do not stack or queue.
- **Never covers content.** Hints appear in margin/whitespace, never over text.
- **Dismissible / non-blocking.** No click required to proceed; nothing waits on the robot.
- Hints are *knowledgeable asides*, in the robot's dry voice — context a hiring manager would
  actually want. Not jokes, not filler.

### Where it appears — a quiet companion throughout
Small presence in many places beats one big moment (this replaces the earlier ≤3 rule):

| Placement | Treatment |
|---|---|
| **Hero** | Small robot beside/below the name — the introduction. Slow float + micro-parallax + occasional eye blink. Its orange seeds the palette. |
| **About** | In the margin; hint adds context the copy doesn't state. |
| **Experience** | Small robot travels down the timeline spine as you scroll; offers a hint at each role (scope, team size, the hard part). |
| **Skills & Impact** | Beside metric tiles; hint explains what a number *meant* in practice. |
| **Contact** | A quiet closing nod — sign-off beat. |

**Motion vocabulary (strictly limited):** slow float, micro-parallax with cursor, slow eye
blink, and a gentle travel along the timeline spine. **No** waving, hopping, spinning,
bouncing, or cute idle animation.

**Asset need:** the robot image must be saved to `public/`. At Phase K we sample its true body
orange and set the accent token from it. For crisp display at small sizes we may need a
cleaned/cropped version (transparent background, robot only, no dusk sky) — the shared image
includes a landscape backdrop that won't work in-margin.

---

## D3 — Icon motif (derived from the robot)

Rather than a generic icon set, one motif pulled from the robot itself, used as the section
marker and small accent throughout.

**The motif: the eye + antenna.**

```
 |            the antenna stroke = a thin orange vertical hairline
 |            the eye            = a small filled circle
(•)           together: a section marker that is unmistakably "the robot"
```

**Applications:**
- **Section eyebrow marker:** a small orange dot (the eye) preceding the mono label —
  `● about` — reads as an LED next to an engraved label.
- **Active/current state:** the dot fills orange; inactive dots are hairline-outlined only.
- **Divider:** the antenna hairline — a 1px vertical orange rule used at section transitions
  or as the timeline spine (this is also the **scroll-drawn line** from Phase C).
- **Bullet points:** the small dot replaces default list bullets.
- **Favicon:** the eye-dot inside the `CG` plate.

This gives a coherent icon language with essentially zero illustration overhead, and it ties
every section back to the mascot.

---

## D4 — Voice & microcopy

Per Phase A: plain, exact, quietly assured. Lowercase-technical labels. Numbers over
adjectives.

**Section eyebrows (lowercase, mono, with the eye-dot):**
```
● about        ● experience        ● impact        ● contact
```

**Nav:** `about` · `experience` · `impact` · `contact` — lowercase, mono, small.

**Buttons / CTAs:**
- Primary: `get in touch` (orange fill, the one strong orange moment in a section)
- Secondary: `download resume` (ink outline / hairline border)
- Text link: `read more →` (ink with orange underline on hover)

**Hero copy structure (Surjith's punchline model):**
```
Channakeshava Gowda            ← giant backdrop type
engineering manager            ← mono role label, small
I build teams and systems that ← statement, ink
scale.                         ← punchline word/phrase in ORANGE
```
The orange word is the payoff. Exact wording drafted at Phase I/K.

**Metadata style (mono, small, muted):**
```
bengaluru, india · 5+ yrs · distributed systems
2026 → present
```

**Microcopy do / don't:**
- ✅ `led a 12-person team through an EKS migration serving 5M+ requests/day`
- ❌ `passionate leader driving synergistic outcomes`
- ✅ `3,000+ concurrent connections` — number stated plainly
- ❌ exclamation marks, hype, filler adjectives
- ✅ arrows for direction: `2024 → 2026`, `read more →`
- ❌ emoji anywhere in the UI

---

## D5 — Brand kit summary

| Element | Decision |
|---|---|
| Primary identity | `Channakeshava Gowda` set large in display sans, ink |
| Compact mark | `CG` in mono, tracked, hairline plate |
| Handle | `cg6.tech` / `CG6-Tech` (unchanged) |
| Robot | **CG's second brain** — small (28–56px), present throughout, offers one-line hints on hover/in-view. Additive only. |
| Icon motif | eye-dot (`●`) + antenna hairline, derived from the robot |
| Section labels | lowercase mono with a leading orange eye-dot |
| Role index | en-dash catalog style — `role–01`, `role–02` — **kept** |
| Accent discipline | orange = signals only (robot, punchline word, CTA, drawn line, eye-dot) |
| Wordmark color | always ink, never orange |

---

## ▮ REVIEW D — DECISIONS LOCKED (2026-08-10)

1. ✅ **Icon motif approved:** eye-dot (`●`) + antenna hairline. Used for section eyebrows,
   list bullets, the timeline spine (= the scroll-drawn line), and the favicon.
2. ✅ **Robot reframed as CG's second brain** — small and subtle, present wherever it helps,
   offering short hint annotations. NOT a large hero centerpiece. See D2 (revised).
3. ✅ **En-dash role index kept** (`role–01`, `role–02`) for the TE catalog feel.

### Consequence for the hero (updates D4 + Phase K)
The hero is now **type-led, not robot-led**: the giant `Channakeshava Gowda` name carries the
composition, with the small robot as a companion beside it rather than a figure in front of it.
This is a *departure from* Surjith's layering (subject-in-front-of-name) — we keep his
**orange punchline word**, but the name is no longer partially occluded. Revisit at Phase I
wireframes to confirm the composition still has enough impact without a large focal figure.

### Carry-forward requirements
- **Hint content:** ~6–10 one-line robot hints to be written at Phase L alongside the résumé
  content model (one per role + a few per metric).
- **A11y:** hints must be non-essential, non-blocking, and available to screen readers as
  supplementary text; honor `prefers-reduced-motion`.

---

## D6 — Robot asset: authored as SVG  (decided 2026-08-10)

> **User direction:** *"use it very minimally — I don't have any proper png or svg, or you
> create one on your own, either 3d or svg anything."* Plus: *"take the approach where the
> mascot is not hero but it's present in a subtle way."*

**Decision: author the robot as a hand-built inline SVG.** Not the shared raster image.

**Why SVG is the right call here:**
- **Crisp at 28–56px** — a raster cutout of an illustrated scene would go mushy at that size.
- **Colored by design token** — the body uses `currentColor`/CSS vars, so the robot's orange
  can never drift from the palette. (Note: this inverts the earlier plan — instead of sampling
  the robot to define the accent, the **accent now defines the robot**. Phase E sets the hex.)
- **Animatable in-place** — eye blink, antenna twitch, float; no sprite sheets.
- **~1–2KB** — no image request, no layout shift, works in `prefers-reduced-motion`.
- Full control of silhouette so it reads instantly at small scale.

**Design brief for the SVG** (traced from the shared image's character, simplified):
- Boxy head, slightly wider than tall, with **two large round eyes** (the signature).
- **Twin antennas** — thin verticals, one may end in a small dot (ties to the eye-dot motif).
- **Orange body**, geometric and simple; thin legs/base.
- Reduced to ~8–12 shapes total. Flat, no gradients, no shading — matches the flat art
  direction from Phase C.
- Eyes are the one non-orange element (a cool tone), giving it life against the warm palette.

**Sizes:** `sm` 28px (margins, inline hints) · `md` 40px (section companions) · `lg` 56px
(hero). Never larger.

**Hero composition (resolved):** the hero is **type-led**. The giant `Channakeshava Gowda`
name plus the mono role label carry the composition; the robot appears small nearby with a
single hint. We keep Surjith's **orange punchline word** for impact, and the scroll-drawn
orange line begins here. The robot is a *presence*, not the subject.
→ Hero variants still to be sketched and compared at **Phase I**, since CG noted they can't
picture it yet. Seeing options will decide it.

**Original raster image:** may still be used *once*, large, as an optional framed hero visual
if the wireframes call for it — but it is not required and not the default.

---

## D7 — Robot asset: FINAL decision (2026-08-10, after 3 iterations)

**Two assets, one character — split by role:**

| Asset | Where | Why |
|---|---|---|
| **Live 3D robot** (three.js / R3F) | **Hero only** — one interactive moment | Real depth + warm lighting + glowing eyes. Earns its weight by appearing once. |
| **2D SVG robot with antennas** | Everywhere small — margins, hints, beside metrics, timeline, footer, favicon | ~1KB, crisp at 20–56px, token-colored, no WebGL dependency. |

### Iteration log — what we learned (keep this; it's the design rationale)
- **v1 SVG (blue/cyan eyes):** read well, but user wanted closer fidelity to their character.
- **v2 SVG (black eyes, long antennas):** ❌ *"looks like an ant"* + *"black color made it more
  creepy."* Two lessons:
  1. **Black eyes kill the character.** They read as hollow/dead. The source robot's charm is
     entirely in its **glowing** eyes — glow = alive and friendly. Black is not an option even
     though it would be the more "disciplined" single-accent choice. **Warmth beats purity here.**
  2. The insect read came from **black eyes + long thin antennas together**, not the antennas
     alone. With glowing eyes, antennas are charming — they're the silhouette's signature.
- **3D prototype:** ✅ approved. Glowing emissive eyes + real lighting nailed the character.

### Locked robot spec
- **Eyes: GLOWING, cool blue-cyan.** Never black. This is the one non-orange color on the site
  and it is non-negotiable — it's what makes the robot alive rather than creepy.
  (Amends Phase C's "orange is the only accent": the eye glow is a deliberate, tiny exception.)
- **Antennas: KEPT** — twin, with dot tips. Signature silhouette element.
- **Body: TE brand orange `#F2673A`** — user explicitly confirmed they like TE's orange. This
  is now the locked accent hex (Phase E builds the ramp around it).
- Boxy retro head, side pods, chunky-but-not-squat torso, thin legs.
- **Sizes:** SVG at 20 / 28 / 40 / 56px. 3D in hero only.

### Rendering strategy
Live 3D in the hero; the SVG (not pre-rendered PNGs) for every small appearance — simpler,
lighter, and infinitely crisp. R3F loads lazily and only for the hero, so the rest of the page
carries no WebGL cost.

### ✅ Approved assets (working references saved in-project)
- **`design/assets/robot-catalog.html` — THE CANONICAL SPEC.** All 10 expressions, size
  legibility table (16→56px), the full motion vocabulary, the hint mechanic, six in-context
  use cases, and the dark-surface variant. Port directly into the React component.
- `design/assets/robot-v4-lightning.html` — the lightning/wobble exploration (dev history).
- `design/assets/robot-3d-reference.html` — approved **3D prototype** (three.js): geometry,
  materials, warm-afternoon lighting rig. Port into R3F for the hero.

---

## D8 — FINAL robot spec (supersedes earlier eye/colour notes)

### Eyes — dark glossy lens, NOT glowing, NOT flat black
The earlier "glowing cyan eyes" decision was **reversed** after review. The winning treatment is
a **dark recessed lens with real depth**. Flat black was the creepy version; darkness wasn't the
problem, *flatness* was. Four ingredients:
1. **Radial lens gradient** lit from the top-left — `#5B5049 → #2E2823 → #100E0C` at `cx 34% cy 28%`.
2. **Socket rim shadow** (`#7A2A0E` at ~50% alpha on the outer edge) so the eye sits *inside* the face.
3. **Bright catchlight** — small `#FFF4EC` circle, offset up-left.
4. Optional faint **bounce light** low-right.

At ≤20px the gradient flattens to solid `#191512` + catchlight (a gradient is invisible there).
**Eye size:** round `r=4.2`; bar eyes `8.4 × 3.4`. Deliberately smaller than the first drafts.

### Expressions (10) — eyes only, everything else identical
`neutral` (idle) · `focused` (reading/scroll-active) · `happy` (success/sign-off) ·
`curious` (hover/hint open, + −7° head tilt) · `resting` (blink/idle-long) ·
`thinking ⚡` (processing) · `looking` (points at content) · `wink` (easter egg) ·
`alert` (new/attention) · `sad` (404/empty state — optional).

**Rule:** every expression is built from **solid bold shapes**, never thin strokes — that's what
keeps them legible at 16–20px.

### The thinking bolt — SHAPE, not colour
A jagged polyline arcing between the two antenna tips, with two upward **branching forks**.
- **A single dark stroke** (`#241A12`, width 1.5) — no amber/white layering. The earlier
  three-colour version was too loud; user: *"make it more subtle — the shape, not colours."*
- Uses `currentColor` in production so it **inverts automatically**: dark on cream, light
  (`#F6E7CE`) on ink.
- Animation: strikes **twice per 2.8s cycle** with irregular opacity flicker plus a sub-frame
  horizontal jitter, so it never reads as a smooth loop.
- Only appears in the `thinking` state.

### Motion vocabulary (8)
| Motion | Trigger | Detail |
|---|---|---|
| float | always | −2.5px, 4.4s ease-in-out |
| blink | idle | scaleY→0.1 every 5.6s |
| hover tilt | hover | −8° + 3px lift, springy overshoot `cubic-bezier(.34,1.56,.64,1)` |
| click wobble | click | damped −9° → +6° → −4° → 0 over .9s |
| scroll lean | scroll | leans into direction, proportional to velocity |
| spine travel | scroll | rides down the timeline spine |
| bolt strike | thinking | irregular flicker + jitter |
| cursor follow | mousemove | head rotates toward pointer, catchlights shift like pupils |

All disabled under `prefers-reduced-motion`.

### Sizes
`16px` favicon/inline · `20px` nav mark · `28–30px` beside metrics/hints · `40px` section
companion · `56px` max for SVG. Above that → the 3D robot (hero only).

---

## D9 — LOCKED GEOMETRY & INTERACTIONS (final, 2026-08-11)

**Canonical reference: `design/assets/robot-FINAL.html`** — port geometry and CSS from here.

### Head
- **Height 28** (`rect x5 y13 w34 h28 rx5.5`) — the TALL variant. Chosen over the original 24
  because it leaves real face below the eye plate, and reads closer to CG's source character.
- Eye plate: `x8 y16.5 w28 h14 rx3`. Side pods at `y22`. Face area = `y30.5 → 41`.
- Antennas: twin, angled outward, `stroke-width 2`, dot tips `r1.9`.

### Eyes — dark glossy lens (NOT glowing, NOT flat black)
- Socket `r4.2` fixed; **pupil group** `r2.9` (lens gradient + catchlight `r1.15`) translates
  *inside* it, clamped to `MAX 1.25` viewBox units.
- Lens gradient `#5B5049 → #2E2823 → #100E0C` at `cx34% cy28%`; socket rim `#7A2A0E @ 50%`.
- ≤20px: flatten to solid `#191512` + catchlight.

### Blink — lid sweeps DOWN from the top
An orange (`#E85A2C`) rect **clipped to each eye socket**, translating from `-10px` to `0`.
NOT `scaleY` about the centre — that collapses inward and reads as closing from below.
Timing: `5.2s` cycle, lid down at 95–97.5%.

### Smile — soft curved stroke, ALWAYS present  (v10, final)
Superseded the single-bar/LED versions. The bar never smiled, and the wipe-on read as a
progress bar filling — user: *"don't make it dark like a progress bar, just move the bar like
a curve… keep the smile subtle and like shade as it is."*

- **One constant shade: `rgba(25,21,18,.42)`**, `stroke-width 1.6`, `stroke-linecap round`,
  no fill. **The colour and width NEVER change** — no darkening, no filling, no opacity ramp.
- **Always visible in every state.** The robot is never "smile off"; it simply smiles more or
  less. This is what keeps it warm rather than mechanical.
- **Interaction = curve morph only.** The quadratic control point animates
  `M18.0 34.9 q4.0 0.9 8.0 0` (rest) → `M17.6 34.7 q4.4 2.2 8.8 0` (warm) over `.42s`
  `cubic-bezier(.3,.7,.2,1)`.
- **Curve depth chosen: 2.2** ("warm"). 1.1 is too faint; 4.2 reads as a cartoon grin.
- Sits on the face at `y≈34.7`, clear of the eye plate (which ends at `y30.5`).
- **Small sizes:** thicken the stroke only — 1.6 @56px → 1.8 @40 → 2.1 @30 → 2.5 @22 → 2.9 @17.
  Shade stays identical.
- **On dark: NO CHANGE** — keeps the same `rgba(25,21,18,.42)`. The mouth sits on the *orange
  face*, not on the page background, so it must not invert. (An early version lightened it on
  dark; that was wrong and was reverted.) Only the **bolt** inverts, since it sits outside the head.

### Per-state mouth curves
| State | Path |
|---|---|
| neutral | `M18.0 34.9 q4.0 0.9 8.0 0` — gentle content-smile |
| focused | `M18.2 34.9 q3.8 0.8 7.6 0` — tighter, still smiling |
| happy | `M17.6 34.7 q4.4 2.2 8.8 0` — warmest curve |
| content | `M17.7 34.7 q4.3 2.0 8.6 0` — with eyes closed |
| curious | `M18.6 34.8 q3.4 1.7 6.8 .3` — slightly lopsided |
| thinking | `M18.6 34.9 q3.4 0.7 6.8 0` — small and soft |

### Mouth follows gaze
The mouth group translates with the pupils at **40% of pupil travel** (and 60% of that on the
Y axis). This is what makes the whole face read as one reacting surface rather than eyes
moving inside a static mask.

### Thinking bolt — centred vertical glyph
- Path: `M23.6 -9.4 L17.8 -2.4 L21.2 -2.4 L19.4 3.0 L26.0 -4.6 L22.4 -4.6 Z`
- **Centred above the head**, vertical. Earlier antenna-to-antenna arcs read as *smoke*; a
  vertical glyph reads unmistakably as lightning at every size down to 17px.
- Single fill, `currentColor` — dark `#241A12` on cream, light `#F6E7CE` on ink.
- Strikes twice per `2.8s` cycle with irregular opacity flicker.

### Interaction summary
| Trigger | Response |
|---|---|
| mousemove | pupils track cursor (clamped), head rotates `dx*5°` |
| hover | smile bar wipes on; bolt begins striking |
| idle | float `−2.5px / 4.4s`; blink every `5.2s` |
| click | damped wobble `−9° → +6° → −4° → 0` over `.9s` |
| scroll | leans into direction; travels the timeline spine |

All motion disabled under `prefers-reduced-motion` (smile resolves to lit, bolt to 90% opacity).

### Iteration log (why these choices)
v1 cyan glow → v2 black eyes *("looks like an ant… creepy")* → v3 dark glossy lens ✅ →
v4 three-colour bolt *("too colourful — refine the shape")* → v5 tip-to-tip tapered bolt
*(still read as smoke)* → v6 centred vertical bolt ✅ + smile trial → v7 LED segments
*(overlapped the eye plate)* → **v8 tall head + single bar ✅ FINAL**.

**Rebuild note:** a full expression catalog (all 10 states at the final geometry) should be
regenerated as the React component is built in Phase J.

---

## ▮ REVIEW D — PHASE CLOSED (2026-08-10)

| Decision | Outcome |
|---|---|
| Wordmark | `Channakeshava Gowda` display type; `CG` mono plate compact mark; ink never orange |
| Icon motif | eye-dot (`●`) + antenna hairline — section eyebrows, bullets, timeline spine, favicon |
| Robot role | **CG's second brain** — small, subtle, present throughout, one-line additive hints |
| Robot assets | **3D in hero** + **2D SVG everywhere small** (both approved, references saved) |
| Eyes | **glowing blue-cyan, never black** — the character depends on it |
| Antennas | kept (signature silhouette) |
| Accent | **TE brand orange `#F2673A`** — locked |
| Role index | en-dash catalog style `role–01` — kept |
| Hint voice | dry, knowledgeable, one line — tone approved |

**Next: Phase E — Color system.** Build the full palette around `#F2673A` + the cream base:
ink ramp, surface ramp, hover/active states, hairline border, the eye-glow cyan as a
sanctioned exception, and WCAG AA validation for every text/background pair.

# Phase G — Grid & Spatial System

*Written 2026-08-11. Depends on [E-color.md](E-color.md) (the hairline is the only border) and
[F-typography.md](F-typography.md) (measure caps, mono label sizes). Nothing here needs new
tokens beyond spacing.*

The whole system rests on one number: **8px**. Every spacing value, every gutter, every radius
and every hairline offset is a multiple or a documented half-step of it. That single constraint
is what makes an editorial page read as *engineered* rather than merely tidy.

---

## The container

| Token | Value | Role |
|---|---|---|
| `--page-max` | `1200px` | outer content max-width. Hard ceiling for everything except full-bleed dark sections and the hero's giant name. |
| `--page-pad` | `clamp(20px, 5vw, 64px)` | left/right page padding. Never less than 20px — that is the minimum thumb-safe edge on a 360px phone. |
| `--measure` | `600px` | body copy cap (≈70 characters, per F). |
| `--measure-lead` | `620px` | lead paragraph cap. |

```css
.container{ width:100%; max-width:var(--page-max); margin-inline:auto; padding-inline:var(--page-pad) }
```

**Full-bleed rule:** only the *background* goes edge-to-edge. The content inside a full-bleed
dark section still sits in `.container`. A dark band whose text runs to the viewport edge looks
like a mistake at 1600px.

---

## The columns

**12 columns, 24px gutter, desktop.** Twelve because the layouts below need halves (6+6), thirds
(4+4+4) and the 7/5 hero split — twelve is the smallest count that gives all three cleanly.

| Breakpoint | Width | Columns | Gutter |
|---|---|---|---|
| `sm` | `< 640px` | **1** | 16px |
| `md` | `640–1023px` | **6** | 20px |
| `lg` | `≥ 1024px` | **12** | 24px |

```css
.grid{ display:grid; gap:24px; grid-template-columns:repeat(12,minmax(0,1fr)) }
@media (max-width:1023px){ .grid{ gap:20px; grid-template-columns:repeat(6,minmax(0,1fr)) } }
@media (max-width:639px){  .grid{ gap:16px; grid-template-columns:1fr } }
```

`minmax(0,1fr)` not `1fr` — plain `1fr` refuses to shrink below its content and blows out the
grid the first time a long unbroken string (a URL, a package name in a mono chip) lands in a cell.

### The standing column assignments

| Layout | lg (12) | md (6) | sm (1) |
|---|---|---|---|
| Hero: name/copy vs robot | 7 / 5 | 6 / 6 (stacked) | stacked, robot first |
| Section header vs body | 3 / 8 (+1 empty) | 6 / 6 stacked | stacked |
| Experience row: meta vs content | 3 / 9 | 6 / 6 stacked | stacked |
| Stat tiles | 3 × 4 cols | 2 × 3 cols | 1 up |
| Skill groups | 4 × 3 cols | 2 × 3 cols | 1 up |
| Contact: pitch vs channels | 6 / 6 | 6 / 6 stacked | stacked |

**The 3 / 8 section header** is the most repeated unit on the site: a mono eyebrow plus title in
a narrow left rail, body in a wide right column, one column left empty at the right edge. That
trailing empty column is deliberate — it keeps text from ever touching the container edge and it
is where the asymmetry in the layout comes from. Do not fill it.

---

## Vertical rhythm

Spacing steps. Only these values appear in the codebase:

| Token | Value | Use |
|---|---|---|
| `--s-1` | `4px` | icon-to-label, inside chips |
| `--s-2` | `8px` | tight stacks, eyebrow dot gap |
| `--s-3` | `12px` | label to value |
| `--s-4` | `16px` | paragraph spacing, inside-card stacks |
| `--s-5` | `24px` | card padding, gutter |
| `--s-6` | `32px` | between subsections |
| `--s-7` | `48px` | card padding (large), between rows |
| `--s-8` | `64px` | section header to section body |
| `--s-9` | `96px` | between major blocks inside a section |
| `--s-10` | `128px` | section top/bottom padding (desktop) |

### Section padding

```css
.section{ padding-block:clamp(64px, 10vw, 128px) }
```

One `clamp` for every section, so vertical rhythm scales with the viewport instead of stepping
at breakpoints. 64px is the floor — below that, sections stop reading as separate.

**Dark sections get more air:** `clamp(88px, 12vw, 160px)`. A dark band needs extra padding or
the inversion feels cramped; the reference sites all do this.

### The four vertical relationships that matter

1. eyebrow → title: **`--s-3`** (12px). They are one unit; more than this and the dot detaches.
2. title → body: **`--s-4`** (16px) in the narrow rail; the 3/8 grid supplies the horizontal gap.
3. section header → section content: **`--s-8`** (64px).
4. section → section: the `.section` clamp on both, so **128 + 128 = 256px** between content at
   desktop. That looks like too much written down and is correct on screen — it is what makes the
   page feel calm rather than dense.

---

## Surfaces, hairlines, radius

### Radius scale — deliberately tiny
| Token | Value | Use |
|---|---|---|
| `--r-1` | `3px` | buttons, chips, code inline |
| `--r-2` | `6px` | cards, tiles, panels |
| `--r-3` | `10px` | the one large panel (hero robot stage, if it gets a surface) |

Nothing is pill-shaped and nothing is above 10px. Small radii read as machined; large radii read
as friendly-consumer-app and would fight the whole art direction. `border-radius:999px` is
banned outside the robot's own geometry.

### Hairlines are the only border
From E: `--hair: rgba(28,26,23,.13)`. One rule for the entire site:

```css
.hair{ border:1px solid var(--hair) }
.hair-t{ border-top:1px solid var(--hair) }
```

On dark surfaces the hairline inverts to `rgba(232,223,208,.14)` — token **`--hair-dark`**. That
is the one spacing/surface token this phase adds to E's palette.

**No shadows.** Elevation is expressed by `--cream-2` fill plus a hairline, never by a shadow.
The single permitted exception: the robot's contact shadow ellipse, which is part of the mascot,
not the UI. Shadows on a cream base go muddy and instantly cheapen the page.

### The tile
The most repeated surface on the site:

```
┌─────────────────────────┐   fill: --cream-2
│                         │   border: 1px --hair
│  2.4B          ← sans 600, --stat
│  api requests / day     │   ← mono 10px, +.07em, --ink-muted
│                         │   padding: --s-5 (24px)
└─────────────────────────┘   radius: --r-2 (6px)
```

Sans figure over mono label — per F, the single most repeated typographic unit. The tile just
gives it a surface.

---

## Alignment rules

- **Everything is left-aligned.** No centered headings, no centered body copy. Centering is for
  posters; a left rail is what makes a document look authored. The only centered things on the
  site are the robot within its stage and the footer sign-off line.
- **Optical alignment for the eyebrow dot.** The 6px orange dot sits *outside* the text's left
  edge, in the gutter — the text stays flush to the column, the dot hangs. Use
  `padding-left:14px` with the dot absolutely positioned at `left:0`, not a flex row, or the text
  shifts and breaks the rail.
- **Mono labels align to the baseline grid, not the box.** Mono at 10–11px with +.07em tracking
  sits visually high in its line box; nudge with `line-height`, never with margin.
- **Numbers align left, not right.** These are achievements, not a ledger (per F).

---

## Responsive behaviour

Three breakpoints, and the rule at each is *collapse, never shrink*:

| Breakpoint | What changes |
|---|---|
| `≥1024px` | full 12-col layouts as tabled above |
| `640–1023px` | 12→6 cols; every side-by-side becomes stacked; stat tiles 3-up → 2-up; hero robot moves above the copy |
| `<640px` | single column; `--page-pad` at its 20px floor; stat tiles 1-up; robot scales to 140px and loses the cursor-follow (touch has no cursor) |

**Type does not get its own breakpoints** — the `clamp()` values in F handle it continuously.
**Spacing does not get its own breakpoints** — the `.section` clamp handles it. Only *layout*
changes at breakpoints. This keeps the responsive surface small enough to actually verify.

### Touch
- Minimum hit target **44×44px**, even where the visible control is smaller (mono nav links are
  11px — pad them out).
- The robot's `cursor-follow` and `lean` behaviours are pointer-only: gate on
  `@media (hover:hover) and (pointer:fine)`. On touch the robot keeps breathing and blinking and
  drops the tracking, rather than freezing — a still robot reads as broken.

---

## Tokens

```css
:root{
  /* container */
  --page-max:1200px; --page-pad:clamp(20px,5vw,64px);
  --measure:600px;   --measure-lead:620px;
  /* spacing */
  --s-1:4px;  --s-2:8px;  --s-3:12px; --s-4:16px; --s-5:24px;
  --s-6:32px; --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px;
  /* grid */
  --gutter:24px; --gutter-md:20px; --gutter-sm:16px;
  /* surface */
  --r-1:3px; --r-2:6px; --r-3:10px;
  --hair-dark:rgba(232,223,208,.14);
}
```

---

## Decisions locked

1. **8px base unit**, no exceptions outside the robot's internal SVG geometry.
2. **12 / 6 / 1 columns** at lg / md / sm, gutters 24 / 20 / 16.
3. **1200px max-width** — not 1280 or 1440. At 1200 the 3/8 section header keeps a comfortable
   measure without the body column drifting past 70 characters, which is the constraint that
   actually decides this number.
4. **`padding-block:clamp(64px,10vw,128px)`** for every light section; `clamp(88px,12vw,160px)`
   for dark ones.
5. **Radius ceiling 10px**, default 6px, buttons 3px. Nothing pill-shaped.
6. **No shadows anywhere.** Elevation = `--cream-2` + hairline. Only the robot's contact shadow
   is exempt.
7. **Everything left-aligned**; the trailing 12th column stays empty on section headers.
8. **Only layout responds to breakpoints** — type and spacing use `clamp()` and respond
   continuously.

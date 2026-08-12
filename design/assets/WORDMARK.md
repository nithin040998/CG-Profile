# Wordmark — `CG.`

*Locked 2026-08-11. Supplied by CG from his existing site (`.glass-navbar .nav-brand
.logo-text`) and converted to outlined SVG. This supersedes the text wordmark sketched in
[D-brand.md](../D-brand.md).*

## What it is

`CG.` set in **Outfit 800** at **`letter-spacing:-.05em`** — the exact spec from CG's existing
CSS — with the period in the accent colour.

The glyphs are **outlined to paths**, not set in live text. Files:
- [wordmark.svg](wordmark.svg) — standalone asset (favicon, OG image, social)
- inlined in [landing.html](landing.html) — the nav instance

### Why outlined and not a webfont

Setting it as text would add **Outfit as a third font family** to a system that locked two
(Geist + Geist Mono, [F-typography.md](../F-typography.md)) — one extra network request and
~15KB for exactly three glyphs. Outlined, the mark is ~1.2KB of inline path data, renders
identically everywhere, and cannot shift or fall back to a system font on a slow connection.
It also stops the wordmark drifting if the type stack is ever revised.

Provenance: outlines extracted from Outfit 800 (`fonts.gstatic.com/s/outfit/v15`, upem 1000,
`usWeightClass` 800) with fontTools, laid out with `-.05em` tracking applied as real advance-width
offsets, then flipped into SVG coordinates and trimmed to ink bounds.

## Geometry

| Property | Value |
|---|---|
| viewBox | `0 0 1607 732` |
| Aspect ratio | **2.195 : 1** |
| Bounds | tight to the ink — **no side bearings** |
| Baseline | at `y=530` (the dot sits on it; C/G overshoot to 732 as round letters should) |

Because the bounds are tight, the mark aligns optically with no correction. **Drive it by
height, never by width:**

```css
.wm svg{ height:19px; width:auto; }
```

19px in a 64px nav gives a cap height that matches the 15px sans it replaced. Minimum legible
size is **14px height**; below that the dot starts to merge with the G.

## Colour

Two independent layers, which is the whole point of the structure:

| Layer | Fill | Notes |
|---|---|---|
| Letters (`<g fill="currentColor">`) | **`currentColor`** | inherits from the parent — `--ink` on cream, `--dark-fg` on dark. One asset, both surfaces. |
| Dot (`.cg-dot`) | **`--orange` `#F2673A`** | one of the permitted orange spends ([E-color.md](../E-color.md)) |

The standalone `wordmark.svg` hardcodes `#F2673A` on the dot since it has no CSS context.
The inline copy uses `.cg-dot{fill:var(--orange)}` so it can hover to `--orange-lo`.

**The dot is a fill, never text** — which is exactly why it is allowed to be `--orange` rather
than `--orange-text`. It carries no contrast requirement because it carries no information; the
letters do. Remove the dot and the mark still reads `CG`.

## Accessibility

The link carries the accessible name; the SVG is decorative:

```html
<a class="wm" href="#top" aria-label="CG — back to top">
  <svg viewBox="0 0 1607 732" role="img" aria-hidden="true" focusable="false">…</svg>
</a>
```

`aria-hidden` + `focusable="false"` on the SVG — otherwise IE/older engines put the SVG in the
tab order and screen readers announce the mark twice.

## Behaviour

- **Click → robot plays `wink`**, then returns to `neutral` after 1.2s. The easter egg from the
  placement map in [ROBOT-LIB.md](ROBOT-LIB.md); the wordmark is its trigger.
- **Hover → the dot warms** to `--orange-lo` (`--t-3`). The letters do not move — no transform
  on hover, per [H-motion.md](../H-motion.md).
- `overflow:visible` on the SVG so the dot's edge never clips at small sizes.

## React port (Phase J)

```tsx
export function Wordmark({ height = 19 }: { height?: number }) {
  return (
    <svg viewBox="0 0 1607 732" height={height} width={height * 2.195}
         role="img" aria-hidden="true" focusable="false" style={{ overflow: 'visible' }}>
      <g fill="currentColor">
        <path d="M379 732Q…" />   {/* C */}
        <path d="M1020 732Q…" />  {/* G */}
      </g>
      <path className="cg-dot" d="M1508 732Q…" />
    </svg>
  );
}
```

Copy the three `d` attributes verbatim from [wordmark.svg](wordmark.svg). Do not re-round the
coordinates — they are already at half-unit precision on a 1000-upem grid.

## Also use it for

- **favicon** — the `CG.` mark on `--cream`, or letters knocked out of `--orange` at 16px
  (at that size drop the dot: it becomes a single pixel of noise)
- **OG / social card** — mark bottom-left on cream, name in Geist
- **404 page** — mark plus the robot at `sad`

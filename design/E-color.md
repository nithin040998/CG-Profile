# Phase E — Color System

*Locked 2026-08-11. Approved by CG from the rendered robot-showcase page — "loved the color
palette, the color combination, dark color used and UI style". These are the exact values from
that page, now formalized with measured contrast.*

---

## The palette

### Light surfaces (the default world)
| Token | Hex | Role |
|---|---|---|
| `--cream` | `#F8EFDE` | page background. Warm off-white — the base of the whole site. |
| `--cream-2` | `#F1E6D2` | raised surface: cards, tiles, panels, code chips. |
| `--hair` | `rgba(28,26,23,.13)` | hairline borders + dividers. **The only border style.** |

### Ink
| Token | Hex | Role | On cream |
|---|---|---|---|
| `--ink` | `#1C1A17` | all headings + body text. Warm near-black, never pure `#000`. | **15.21 AAA** |
| `--ink-muted` | `#6B645A` | secondary text, captions, descriptions, mono labels. | **5.12 AA** |

### Orange (the accent)
| Token | Hex | Role | Notes |
|---|---|---|---|
| `--orange` | `#F2673A` | **fills only** — dots, buttons, robot body, active marks. | 2.71 on cream — **NOT for text** |
| `--orange-text` | `#B83F18` | orange *text* on cream when needed | **4.89 AA** — the shallowest that passes |
| `--orange-deep` | `#C9481F` | robot plate, antennas, pressed states | 4.15 — large text / UI only |
| `--orange-hi` | `#F87A4B` | top of the body gradient | decorative |
| `--orange-lo` | `#E85A2C` | bottom of the body gradient, eyelids | decorative |

### Dark surface (the contrast moment)
| Token | Hex | Role | On dark |
|---|---|---|---|
| `--dark` | `#17140F` | dark section background. Warm near-black, not neutral grey. | — |
| `--dark-fg` | `#E8DFD0` | text on dark | **13.90 AAA** |
| `--dark-muted` | `#9C9488` | secondary text on dark | **6.13 AA** |
| `--orange-on-dark` | `#F2673A` | accent on dark — same orange works here | **5.93 AA** |
| `--orange-glow` | `#F2A05A` | code keywords / highlights on dark | **8.70 AAA** |

> **Why the dark is `#17140F` and not `#000` or `#111`:** it carries the same warm bias as the
> cream, so switching between them feels like one material under different light rather than two
> different sites. Pure black next to warm cream reads as a broken theme.

---

## Usage rules

### The orange budget — this is the discipline that makes it work
Orange appears on roughly **2–5% of pixels**. Borrowed directly from Teenage Engineering, where
orange marks *one* tag and three version numbers on an otherwise white page.

**Orange is allowed on:**
- the 6px eyebrow dot before every section label
- the robot (it *is* the orange — this is the main spend)
- one primary CTA per view
- active/current state marks, focus rings
- hairline highlights on hover
- one punchline word in the hero tagline

**Orange is NOT allowed on:**
- body text or headings (fails contrast — use `--orange-text` if you truly need orange text)
- large background fills (except a single deliberate hero moment)
- more than one CTA in the same viewport
- decorative gradients spread across sections

### Buttons — use INK on orange, never white
| Text | On `--orange` | Verdict |
|---|---|---|
| `--ink` `#1C1A17` | **5.60** | ✅ use this |
| white | 3.10 | ❌ fails |
| `--cream` | 2.71 | ❌ fails |

Dark text on an orange fill is also the TE/Daylight convention, so this is both accessible
*and* correct for the reference language.

Secondary button: solid `--ink` fill with `--cream` text (Daylight's "Get your estimate"
pattern). Tertiary: text + hairline underline.

### Section rhythm — where dark goes
Light is the default; dark is a **punctuation mark**, used at most 1–2 times in the page:
1. cream hero
2. cream body sections (majority)
3. **one dark section** — the highest-impact moment (metrics/Impact, or the contact/footer)
4. cream close (or end on the dark footer)

Never alternate light/dark repeatedly — that reads as stripes, not rhythm.

---

## Contrast — full measured table

Computed with the WCAG 2.1 relative-luminance formula (`/tmp/contrast.mjs`), not estimated.

| Pair | Ratio | Normal text | Large/UI |
|---|---|---|---|
| ink on cream | 15.21 | AAA | AAA |
| ink on cream-2 | 14.05 | AAA | AAA |
| ink-muted on cream | 5.12 | AA | AAA |
| ink-muted on cream-2 | 4.72 | AA | AAA |
| **orange on cream** | **2.71** | **FAIL** | **FAIL** |
| orange-text `#B83F18` on cream | 4.89 | AA | AAA |
| orange-deep on cream | 4.15 | ✗ | AA |
| **ink on orange** | **5.60** | **AA** | AAA |
| dark-fg on dark | 13.90 | AAA | AAA |
| dark-muted on dark | 6.13 | AA | AAA |
| orange on dark | 5.93 | AA | AAA |
| orange-glow on dark | 8.70 | AAA | AAA |
| cream on dark | 16.09 | AAA | AAA |

**The one hard rule that falls out of this:** orange is a *fill* color on light surfaces and a
*text* color only on dark ones.

---

## Tokens

```css
:root{
  /* light */
  --cream:#F8EFDE; --cream-2:#F1E6D2; --hair:rgba(28,26,23,.13);
  --ink:#1C1A17;   --ink-muted:#6B645A;
  /* orange */
  --orange:#F2673A; --orange-text:#B83F18; --orange-deep:#C9481F;
  --orange-hi:#F87A4B; --orange-lo:#E85A2C;
  /* dark */
  --dark:#17140F; --dark-fg:#E8DFD0; --dark-muted:#9C9488; --orange-glow:#F2A05A;
  /* robot (see ROBOT-LIB.md) */
  --cg-mouth:rgba(25,21,18,.42);
}
```

## What this palette owes to each reference
- **Teenage Engineering** — the orange budget and the discipline of spending it on almost nothing.
- **Daylight** — the warm cream base and the ink-filled button on cream.
- **Surjith** — orange justified by the subject (here: the robot *is* the orange).

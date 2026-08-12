# Phase F — Typography

*Locked 2026-08-11. CG chose pairing **B — Geist + Geist Mono** from the rendered
`design/assets/type-specimen.html` A/B.*

---

## The pairing

**Locked: `Geist` (sans) + `Geist Mono` (mono).** Both verified available on Google Fonts
(HTTP 200, 2026-08-11).

| Role | Family | Why |
|---|---|---|
| Sans — everything | **Geist** 400/500/600 | Vercel's grotesque. Tighter and cooler than Inter, with a more engineered skeleton — closer to the hardware-label register the references live in. Excellent at both 72px display and 10px micro. |
| Mono — labels, meta, numbers-as-data | **Geist Mono** 400/500 | Same design source as the sans, so the two share skeletons, x-height and terminals. Mono labels read as the *same voice in a different mode*, not a second typeface bolted on. |

**Why B over A (Inter + JetBrains Mono):** the shared-skeleton pair makes the two-family split
below read as one system speaking twice rather than two families negotiating. It is cooler than
Inter/JetBrains, and the warm cream + orange palette already supplies all the warmth the page
needs — the type does not have to carry it too.

*Rejected alternate: Inter + JetBrains Mono — warmer and more neutral, and a perfectly correct
choice; it just doubles down on warmth the palette already provides.*

### The two-family rule
Sans carries **all** content. Mono carries **only**:
- section eyebrows (`about`, `experience`, `impact`, `contact`)
- dates and metadata (`mar 2024 — feb 2026 · hero motocorp`)
- stat-tile labels (`api requests / day`)
- tech chips (`golang`, `kubernetes`)
- code snippets

Never mono for body copy or headings. That separation is what produces the TE
"hardware-labelled" feel — content in one voice, machine markings in another.

---

## Type scale

| Token | Size / weight | Tracking | Use |
|---|---|---|---|
| `display` | `clamp(40px, 7vw, 72px)` / 600 | `-.03em` | hero name |
| `h1` | 34px / 600 | `-.028em` | section titles |
| `h2` | 22px / 600 | `-.02em` | role titles |
| `h3` | 16px / 600 | `-.012em` | sub-headings |
| `lead` | 20–22px / 500 | `-.02em` | hero tagline, section leads |
| `body` | 14px / 400, `line-height 1.68` | 0 | all paragraphs |
| `small` | 12.5px / 400 | 0 | captions, secondary |
| `label` | **11px mono** / 400 | **`+.09em`** | eyebrows, nav |
| `micro` | **10px mono** / 400 | **`+.07em`** | tile labels, fine print |
| `stat` | 31–40px / 600 | `-.03em` | the big numbers |

**The tracking rule:** display sizes tighten (negative tracking, `-.012` to `-.03em`); mono
labels open up (positive, `+.07` to `+.09em`). Body stays at 0. This contrast — tight headlines
against airy labels — is a large part of why the reference sites feel engineered.

**Measure:** body copy capped at ~600px (≈70 characters). Lead at ~620px.

---

## Applied rules

### Buttons
| Level | Style | Contrast |
|---|---|---|
| Primary | `--orange` fill + **`--ink` text**, 3px radius | 5.60 AA |
| Secondary | `--ink` fill + `--cream` text | 16+ AAA |
| Tertiary | text + 1px `--orange` underline | — |

Never white text on orange (3.10, fails). See [E-color.md](E-color.md).

### Numbers
Stats are set in **sans at 600**, not mono — mono numbers read as data tables; sans numbers read
as achievements. The *label beneath* is mono. That pairing (sans figure + mono label) is the
single most repeated unit on the site.

### Case
- Headings and body: **sentence case**.
- Eyebrows, nav, metadata: **lowercase-technical** (locked in Phase A).
- Never all-caps except optionally the smallest micro labels.

---

## Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

In Next.js use `next/font/google` instead — it self-hosts, eliminates the render-blocking
request, and removes layout shift:
```ts
import { Geist, Geist_Mono } from 'next/font/google';
export const sans = Geist({ subsets:['latin'], weight:['400','500','600'], variable:'--font-sans' });
export const mono = Geist_Mono({ subsets:['latin'], weight:['400','500'], variable:'--font-mono' });
```

Only load the weights listed. Five faces total (3 sans + 2 mono) — keeps the font payload
under ~90KB and protects the Lighthouse target.

## Tokens
```css
:root{
  --font-sans:'Geist',ui-sans-serif,system-ui,sans-serif;
  --font-mono:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  --tracking-display:-.03em; --tracking-h:-.02em; --tracking-label:.09em;
  --leading-body:1.68;
}
```

> **One adjustment carried over from the pairing switch:** Geist's default letterfit is already
> tighter than Inter's, so `display` tracking goes from `-.035em` to **`-.03em`**. The scale
> table above reflects this. Everything else in the scale is unchanged — the sizes were set
> against content, not against a specific face.

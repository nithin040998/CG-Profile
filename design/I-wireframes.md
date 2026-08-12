# Phase I — Wireframes

*Written 2026-08-11. Structure only — no colour decisions, no type decisions, no new tokens.
Everything here is expressed in the Phase G column assignments and the Phase A narrative spine.
Live greybox: `design/assets/wireframes.html`.*

Résumé content is now decoded and grounded (source:
`~/Documents/My Space/Career/Resumes/Channakeshava Gowda.pdf`). Every slot below names the actual
content that goes in it, so Phase J has nothing left to invent.

---

## Page inventory

One long page, five sections, in the Phase A order. Plus a nav and a 404.

| # | Section | id | Surface | The one idea (from A2) |
|---|---|---|---|---|
| 0 | Nav | — | cream, sticky | orientation |
| 1 | Hero | `#top` | cream | "This is CG — an EM for hard distributed systems" + the robot |
| 2 | About | `#about` | cream | leads teams *and* architects the systems |
| 3 | Experience | `#experience` | cream | trajectory: founder → lead → EM, each with real scope |
| 4 | Skills & Impact | `#impact` | **dark** | proof in numbers |
| 5 | Contact | `#contact` | cream | easy to reach, résumé in one click, warm sign-off |

**The dark section is #4.** Per E's section rhythm, dark is used exactly once and goes on the
highest-impact moment — the numbers. It also sets up the contact section to return to cream for
the warm close, which is the emotional arc A2 asks for (proof → invitation).

---

## 0 — Nav

```
lg (12 col) ────────────────────────────────────────────────────────────────
┌──────────────────────────────────────────────────────────────────────────┐
│  CG                        about  experience  impact  contact   [résumé] │
│  └ wordmark, sans 600      └──── mono 11px, +.09em ────┘        └ btn    │
└──────────────────────────────────────────────────────────────────────────┘
   hairline bottom, appears only after scrolling past the hero
```

- Height 64px. Sticky, `backdrop-filter:blur(8px)` over `--cream` at 88% opacity.
- **The bottom hairline and the blur only appear once scrolled past the hero** — at rest the nav
  is invisible against the hero. Toggle a `.is-stuck` class from the same IntersectionObserver
  used for reveals (H).
- Active-section mark: the current link gets a 6px orange dot before it (the eyebrow-dot motif
  from D, reused). This is one of the permitted orange spends in E.
- Wordmark click → robot plays `wink` (the easter egg in the placement map).
- **md/sm:** links collapse to a single `menu` mono label opening a full-height cream sheet.
  Résumé button stays visible at all widths — it is the primary conversion.

---

## 1 — Hero

The signature moment. Surjith's composition as locked in DECISIONS: giant name behind, robot in
front, orange punchline word.

```
lg (12 col) — 7 / 5 split, min-height 88vh
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│   ● available for senior EM roles        (eyebrow, mono + orange dot)      │
│                                                                            │
│   ┌ cols 1–7 ────────────────────────┐  ┌ cols 8–12 ──────────────┐        │
│   │                                  │  │                         │        │
│   │  CHANNAKESHAVA                   │  │      ╭───────╮          │        │
│   │  GOWDA ░░░░░░░░                  │  │      │ (o o) │  ← robot │        │
│   │  ↑ display, clamp(40,7vw,72)     │  │      │  ───  │   240px  │        │
│   │    2 lines, parallax 0.15×       │  │      ╰───┬───╯          │        │
│   │    ░ = robot overlaps the tail   │  │        ╱ ╲              │        │
│   │      of the name (z-index)       │  │       ▔▔▔▔▔  ← shadow   │        │
│   │                                  │  │                         │        │
│   │  Engineering manager who builds  │  │  gaze follows cursor     │        │
│   │  the distributed systems and     │  │  breathe + blink at rest │        │
│   │  the teams that run them.        │  └─────────────────────────┘        │
│   │  ↑ lead, 20–22px, max 620px                                            │
│   │    "and the teams" = orange-text ← the ONE punchline                   │
│   │                                                                        │
│   │  [ view experience ]  [ download résumé ]                              │
│   │   ↑ primary: orange fill + ink text   ↑ secondary: ink fill            │
│   │                                                                        │
│   │  5+ yrs · 12-person team · 5M req/day · bengaluru                      │
│   │  ↑ mono 11px meta row, --ink-muted, · separators                       │
│   └────────────────────────────────────────────────────────────────────────┘
│                                                    scroll ↓ (mono, fades)  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Content, exact:**
- eyebrow: `● engineering manager · bengaluru`
- name: `Channakeshava Gowda` (display; "(CG)" is *not* in the hero — it lives in the wordmark)
- lead: "Engineering manager who builds the distributed systems **and the teams** that run them."
  — the bold span is the orange punchline word.
- meta row: `5+ yrs` · `12-person team` · `5M+ req/day` · `3,000+ connections`
- CTAs: `view experience` (primary), `download résumé` (secondary)

**The overlap is the whole composition.** The robot sits in cols 8–12 but its shadow and left
edge cross into col 7, overlapping the last few characters of "GOWDA". Without that overlap it is
two boxes side by side; with it, it is one image. Give the name `z-index:1`, the robot `z-index:2`.

**md:** robot moves *above* the copy, centred, 200px. Name drops to `clamp(34px,9vw,52px)`.
**sm:** robot 140px, cursor-follow off (G), meta row wraps to two lines, CTAs stack full-width.

**Motion:** the H load sequence, ending with the robot's `looking` glance at the name at 700ms.
No scroll reveal here — it is above the fold.

---

## 2 — About

The 3 / 8 section-header pattern from G, in its purest form.

```
lg (12 col)
┌────────────────────────────────────────────────────────────────────────────┐
│  ┌ cols 1–3 ────────┐   ┌ cols 4–11 ─────────────────────────┐  ┌ 12 ┐    │
│  │ ● about          │   │ Five years of building systems and │  │    │    │
│  │                  │   │ the teams that run them.           │  │ ▓▓ │    │
│  │ (h1, 34px)       │   │ ↑ lead, 20–22px                    │  │ ▓▓ │    │
│  │                  │   │                                    │  │ em │    │
│  │ ┌──────────────┐ │   │ I lead engineering teams and stay  │  │ pt │    │
│  │ │ (o o)  ← 96px│ │   │ in the architecture. Right now      │  │ y  │    │
│  │ │  ───   robot │ │   │ that means AI-driven background     │  │    │    │
│  │ └──────────────┘ │   │ verification at Evaluationz —       │  └────┘    │
│  │  content expr    │   │ agents, real-time visa checks,      │            │
│  │                  │   │ document intelligence. Before that, │            │
│  └──────────────────┘   │ 3,000 live EV chargers at Hero      │            │
│                         │ MotoCorp.                           │            │
│                         │ ↑ body 14px, measure 600px          │            │
│                         │                                     │            │
│                         │ ┌─────────┐┌─────────┐┌─────────┐   │            │
│                         │ │ leads   ││ archi-  ││ ships   │   │            │
│                         │ │ teams   ││ tects   ││         │   │            │
│                         │ └─────────┘└─────────┘└─────────┘   │            │
│                         │  ↑ 3 through-line tiles, 1 line each│            │
│                         └─────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────────────────────┘
```

**The one idea:** the rare combination — leads *and* architects. The three tiles state it as
three verbs so a 30-second skimmer gets it without reading the paragraph.

Tile content (mono label + one short line each):
| Tile | Line |
|---|---|
| `leads` | 12-person cross-functional team; hired 6, managed 9 role transitions |
| `architects` | Golang, Kafka, WebSockets, EKS — real-time systems at scale |
| `ships` | EV charger platform, loyalty platforms, 15+ SaaS/fintech MVPs |

Col 12 stays empty per G. The small robot in the left rail plays `content`.

---

## 3 — Experience

Four roles, reverse-chronological, on a timeline spine. This is the section where the robot's
`focused` expression rides the spine (placement map).

```
lg (12 col) — each row: 3 / 9
┌────────────────────────────────────────────────────────────────────────────┐
│  ● experience                                                              │
│  Trajectory.                                                               │
│                                                                            │
│  ┌ 1–3 ──────────┐│┌ 4–12 ───────────────────────────────────────────┐     │
│  │ feb 2026 —    │●│ Engineering Manager · Band 2                    │     │
│  │ present       │││ Evaluationz India Pvt Ltd                       │     │
│  │               │││ ↑ h2 22px  /  company: body, --ink-muted        │     │
│  │ ┌───────────┐ │││                                                 │     │
│  │ │ owned the │ │││ • Built AI agents automating BGV workflows      │     │
│  │ │ complete  │ │││ • Real-time visa verification via document      │     │
│  │ │ tech fn   │ │││   extraction                                    │     │
│  │ └ ownership │││   • Led org restructuring across a 14-member team │     │
│  │   chip ─────┘ │││ • Hired 4; managed 6 role transitions           │     │
│  │               │││ ↑ body, max 3–4 bullets per role                │     │
│  │               │││                                                 │     │
│  │               │││ golang  ai-agents  document-ai  kubernetes      │     │
│  │               │││ ↑ mono chips, hairline                          │     │
│  └───────────────┘│└─────────────────────────────────────────────────┘     │
│                   │  ← 1px spine, --hair, runs the full section            │
│  ┌───────────────┐│┌─────────────────────────────────────────────────┐     │
│  │ mar 2024 —    │●│ Engineering Manager                             │     │
│  │ feb 2026      │││ Hero MotoCorp                                   │     │
│  │  ...          │││  ...                                            │     │
└────────────────────────────────────────────────────────────────────────────┘
```

**The four rows, in order:**

| Period | Role | Company | Ownership chip |
|---|---|---|---|
| feb 2026 — present | Engineering Manager · Band 2 | Evaluationz India Pvt Ltd | owned the complete technology function |
| mar 2024 — feb 2026 | Engineering Manager | Hero MotoCorp | EV charger platform modernization |
| aug 2022 — mar 2024 | Full Stack Lead | Spurtree Technologies | product delivery · customer impact |
| jun 2019 — aug 2022 | Co-Founder & CTO | Likemindz Solutions | requirement analysis · zero-to-one |

**Structural rules:**
- **The spine is a 1px hairline in the gutter between col 3 and col 4**, with a filled dot at
  each row's top. It is the only vertical rule on the site. It exists because trajectory is the
  idea — a list of jobs does not show a trajectory, a line through them does.
- **3–4 bullets per role, hard cap.** The résumé has more; the site is not the résumé. The
  résumé button exists for readers who want all of it. This is the single most important editing
  decision in the section.
- Education is *not* its own section — it goes as a fifth, unbulleted spine entry:
  `2016 — 2021 · B.E. Computer Science · Cambridge Institute of Technology`.
- Each row is a `.reveal` with the H stagger; the spine dot fills as its row enters.

**md/sm:** the spine moves to the far left (16px in) and every row becomes a single stacked
column beneath it — period, then role, then bullets, then chips.

---

## 4 — Skills & Impact — **the dark section**

The one inversion in the page. Bigger padding (G: `clamp(88px,12vw,160px)`).

```
lg (12 col), --dark background, full-bleed, content in .container
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ● impact                                     ╭───────╮                    │
│  The numbers.                                 │ (◉ ◉) │ ← robot, surprised │
│  ↑ h1, --dark-fg                              │  ───  │   on first entry   │
│                                               ╰───────╯   then thinking    │
│                                                                            │
│  ┌ 4 cols ───┐┌ 4 cols ───┐┌ 4 cols ───┐                                   │
│  │ 5M+       ││ 3,000+    ││ 12        │  ← sans 600, clamp 31–40px        │
│  │ daily api ││ concurrent││ person    │  ← mono 10px, --dark-muted        │
│  │ requests  ││ charger   ││ team led  │                                   │
│  └───────────┘└ conns ────┘└───────────┘                                   │
│  ┌ 4 cols ───┐┌ 4 cols ───┐┌ 4 cols ───┐                                   │
│  │ 20%       ││ 30%       ││ 40%       │                                   │
│  │ downtime  ││ diagnostic││ user      │                                   │
│  │ reduced   ││ accuracy  ││ engagement│                                   │
│  └───────────┘└───────────┘└───────────┘                                   │
│   ↑ 6 tiles, 3-up × 2 rows. hairline = --hair-dark, no fill                │
│                                                                            │
│  ─────────────────── hairline divider, --hair-dark ───────────────────      │
│                                                                            │
│  ┌ 1–6 ─────────────────────┐  ┌ 7–12 ────────────────────────┐            │
│  │ leadership & execution   │  │ architecture                 │            │
│  │ team leadership · org    │  │ distributed systems · micro- │            │
│  │ restructuring · hiring · │  │ services · event-driven ·    │            │
│  │ performance mgmt ·       │  │ cloud-native · HA design ·   │            │
│  │ roadmap ownership        │  │ HLD/LLD                      │            │
│  ├──────────────────────────┤  ├──────────────────────────────┤            │
│  │ ai & automation          │  │ technology                   │            │
│  │ ai agents · fine-tuning ·│  │ golang · node.js · angular · │            │
│  │ inbox automation ·       │  │ docker · terraform · kafka · │            │
│  │ document extraction ·    │  │ websockets · aws · postgres ·│            │
│  │ tampering detection ·    │  │ mongodb                      │            │
│  │ MRZ validation · BGV     │  ├──────────────────────────────┤            │
│  │                          │  │ observability & devops       │            │
│  │                          │  │ dynatrace · grafana · ci/cd ·│            │
│  │                          │  │ kubernetes · perf optimizatn │            │
│  └──────────────────────────┘  └──────────────────────────────┘            │
│   ↑ 5 skill groups, 2 columns. mono group label + · separated body         │
└────────────────────────────────────────────────────────────────────────────┘
```

**The six stat tiles are the payload of the entire site.** They are the "undeniable proof" beat
in A2's arc. Sans figure over mono label, per F's most-repeated unit.

Stats, exact and all sourced from the résumé:
| Figure | Label |
|---|---|
| `5M+` | daily api requests |
| `3,000+` | concurrent charger connections |
| `12` | person team led |
| `20%` | downtime reduced |
| `30%` | diagnostic accuracy gained |
| `40%` | user engagement lift |

**Skill groups are `·`-separated inline lists, not chip grids.** Five groups × 6–8 items each is
~35 chips; as chips that is visual noise and every item reads as equally important. As
`·`-separated prose in mono, it scans in one pass and stays quiet — which is the E discipline
applied to density rather than colour.

**Robot:** enters `surprised` (the jolt) on first scroll into the section, settles to `thinking`
with the bolt strike for the AI group. Both are in the placement map already.

---

## 5 — Contact

Return to cream. The warm close.

```
lg (12 col) — 6 / 6
┌────────────────────────────────────────────────────────────────────────────┐
│  ● contact                                                                 │
│                                                                            │
│  ┌ 1–6 ──────────────────────────┐  ┌ 7–12 ───────────────────────────┐    │
│  │ Let's talk about the hard     │  │  ┌─────────────────────────────┐│    │
│  │ problem you're trying to      │  │  │ email    work@cg6.tech      ││    │
│  │ solve.                        │  │  ├─────────────────────────────┤│    │
│  │ ↑ h1                          │  │  │ phone    +91 96868 89681    ││    │
│  │                               │  │  ├─────────────────────────────┤│    │
│  │ Open to senior engineering    │  │  │ site     cg6.tech           ││    │
│  │ management roles. Fastest way │  │  ├─────────────────────────────┤│    │
│  │ to reach me is email.         │  │  │ github   CG6-Tech           ││    │
│  │ ↑ body, measure 600           │  │  ├─────────────────────────────┤│    │
│  │                               │  │  │ linkedin CG6-Tech           ││    │
│  │ [ email me ] [ download résumé]  │  └─────────────────────────────┘│    │
│  │                               │  │   ↑ hairline rows, mono label   │    │
│  └───────────────────────────────┘  │     + sans value, whole row is  │    │
│                                     │     the hit target (44px min)   │    │
│                                     └─────────────────────────────────┘    │
│                                                                            │
│  ─────────────────────── hairline ───────────────────────                   │
│                    ╭───────╮                                               │
│                    │ (^ ^) │  ← robot, content, breathe slow               │
│                    ╰───────╯     the sign-off. centred (G exception)       │
│         Built by CG · Geist + Geist Mono · 2026                             │
│         ↑ mono micro 10px, --ink-muted, centred                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**No contact form.** A form on a personal portfolio adds a backend, a spam surface, and a
delivery-failure mode, in exchange for saving the reader one click. The channel list is the
better instrument: it is honest about how to reach him and it works offline. `email me` is a
`mailto:` link.

**The sign-off robot is the only centred element besides the footer line** (the G exception).
It plays `content` + `breathe` slow — it is the last thing on the page and the warm note A2 asks
to leave on. On résumé download it plays `happy` (nod), per the placement map.

---

## Cross-cutting

### Reveal assignments (H)
| Section | What reveals | Stagger |
|---|---|---|
| Hero | nothing — load sequence instead | — |
| About | header block, body block, 3 tiles | tiles staggered |
| Experience | each row independently | 60ms, capped 4 |
| Impact | header, then 6 tiles, then skill groups | tiles staggered (cap 4) |
| Contact | header/pitch, channel list, footer | list staggered |

### Robot appearances — 5 total
hero (240px, gaze-follow) · about rail (96px, `content`) · experience spine (72px, `focused`) ·
impact (120px, `surprised`→`thinking`) · footer (96px, `content`). Five is the budget; more and
the mascot stops being a signature and becomes wallpaper.

### 404
Single centred block: robot at `sad`, `404` in display, one line of body, one tertiary link home.

### What is deliberately NOT on this site
- No blog, no case studies, no testimonials, no "my process", no tech-logo wall.
- No light/dark toggle. The dark section is a composed moment, not a theme — a toggle would
  destroy the one inversion E's rhythm depends on.
- No hero video, no page loader.

---

## Decisions locked

1. **Five sections, one page**, in the A2 order; nav + 404 as the only extras.
2. **Dark surface goes on Skills & Impact (#4)**, not on contact — proof gets the inversion, and
   contact returns to cream for the warm close.
3. **Hero = 7/5 with a deliberate overlap** — the robot crosses into the name's column. Without
   the overlap it is two boxes, not one image.
4. **Experience uses a 1px spine in the col-3/4 gutter**, dots per role. Trajectory is the idea,
   so it gets a line.
5. **3–4 bullets per role, hard cap**; education is a fifth spine entry, not a section.
6. **Six stat tiles**, all sourced from the résumé, 3-up × 2 rows on the dark surface.
7. **Skill groups as `·`-separated mono lists, not chips** — 35 chips is noise and flattens
   priority.
8. **No contact form** — channel list + `mailto:`. Rejected the form: backend + spam + failure
   mode to save one click.
9. **Robot appears exactly 5 times.**
10. **No light/dark toggle** — it would destroy the single composed inversion.

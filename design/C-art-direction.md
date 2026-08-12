# Phase C — Curation & Art Direction

*Distilled from the Phase B board (TE, Surjith, Daylight verified by capture; Locomotive by
user description). This statement governs every visual decision after it.*

---

## C1 — The recurring moves worth taking

Across three verified references, the same handful of moves keep appearing. These are the
signal:

**1. Orange is a *signal*, not a surface.**
TE spends it on ~2% of pixels (a tag, three version numbers). Daylight spends it boldly in
one hero then retreats to cream. Surjith earns it from the subject's jacket. Nobody sprays
orange across a layout — it is always *budgeted*.

**2. A warm neutral base, not stark white.**
Daylight's cream (`#F8EFDE` / `#F0E5CF`) is what makes its orange feel warm rather than
alarming. TE's pure white is colder and more fashion-brand. For CG's "warm editorial", cream
wins.

**3. Micro-labels in mono, technical and small.**
TE: lowercase `instruments / audio / designs`. Daylight: `STEP 1`, `HOW DAYLIGHT WORKS`,
`A LOWER BILL EVERY MONTH`. Both read like markings on equipment. This is the single cheapest
way to look "engineered".

**4. One big confident type moment per section.**
Not busy. One headline carries each screen; supporting copy is small and quiet.

**5. Depth by layering, not by shadow.**
Surjith's subject sits *in front of* his giant name. No drop shadows doing the work — real
overlap creates the depth.

**6. High-contrast section rhythm.**
Every ref makes big tonal jumps between sections (TE white→black, Surjith dark→light,
Daylight orange→cream). Sections are *events*, not a continuous scroll.

**7. Motion is calm and earned.**
Daylight's scroll-drawn line. Locomotive's eased reveals + inertia. Nothing bounces or
shouts; things *arrive*.

---

## C2 — Art-Direction Statement

> **CG's portfolio looks like a well-made instrument sitting in warm afternoon light.**
>
> The base is a warm cream — calm, matte, easy on the eye — with soft near-black ink that
> reads as considered rather than harsh. Layout is strict and Swiss: a real grid, hairline
> rules, generous negative space, everything aligned as if it were silkscreened onto a
> device. Small monospace labels mark each section like engravings on hardware, while one
> confident headline carries each screen.
>
> Orange is the brand's single voice, and it is *budgeted*. It appears as the robot, as one
> punchline word, as a thin drawn line, as the primary action — never as a wash. Because the
> base is warm, even small amounts of orange make the whole page feel warm.
>
> The robot is the one moment of personality: it stands in front of CG's name at full scale,
> and its orange is what licenses the accent color everywhere else. Everything around it stays
> disciplined so it can be the thing you remember.
>
> Motion is calm and physical — content eases up into place, a line draws itself as you
> scroll, the robot breathes and drifts a few pixels with the cursor. Nothing bounces.
> Nothing demands attention. The site feels *engineered*, not decorated.

**We are / we are not:**
| We are | We are not |
|---|---|
| a warm instrument in daylight | a stark fashion-brand white cube |
| orange as a signal | orange as a background |
| depth by overlap and layering | depth by drop shadows and glows |
| calm arrivals | bouncy, springy, attention-seeking motion |
| one confident headline per screen | dense, busy, everything-competing |

---

## C3 — Palette seeds (pixel-sampled from captures, real measurements)

| Source | Role observed | Measured hex |
|---|---|---|
| Teenage Engineering | orange accent (`UPDATE` tag) | `#F2673A` |
| Teenage Engineering | background / ink | `#FFFFFF` / `#000000` |
| Daylight | hero orange (saturated) | `#FF6B0A` |
| Daylight | nav CTA orange | `#FD860F` |
| Daylight | outer cream base | `#F8EFDE` |
| Daylight | inner card cream | `#F0E5CF` |
| Surjith | orange punchline word | `#FF6B35` |

**The convergence:** TE `#F2673A`, Surjith `#FF6B35`, Daylight `#FF6B0A` all sit in a narrow
band — a **warm, slightly red-leaning orange**, NOT a yellow-orange. That band is CG's accent
territory. Daylight's creams give us the base.

*Seeds only — the full system (hover/active states, ink ramp, contrast validation) is built
and locked in Phase E.*

**Robot orange:** the robot image was shared in chat but is not yet on disk. Its body orange
appears to sit in the same warm band, which is exactly why this palette works. **To verify:**
sample the real file at Phase K and adjust the accent to match the robot precisely — the robot
should define the orange, not the other way around.

---

## C4 — How each reference is being used (no cloning)

| Ref | What we take | What we leave |
|---|---|---|
| **Teenage Engineering** | restraint, orange-as-signal, lowercase hardware labels, en-dash naming, grid rigor | pure white + pure black, ultra-heavy display type, product-catalog structure |
| **Surjith** | hero composition: giant name behind / subject in front / orange punchline word | dark moody hero, photo-of-person, italic serif name |
| **Daylight** | cream base, mono step-labels, numbered-step rhythm, scroll-drawn line, "budget the orange" | full-bleed saturated hero, three type families, illustration-heavy sections |
| **Locomotive** | calm eased reveals, smooth inertia scroll feel, minimal layout | (nothing structural — motion inputs only) |

---

## C5 — Direct consequences for the build

1. **Base = warm cream**, not white. Ink = soft near-black, not `#000`.
2. **One accent** in the `#F2673A`–`#FF6B35` band, budgeted: robot, one punchline word,
   thin drawn lines, primary CTA, small labels. Never a large fill.
3. **Light hero** (already locked) using Surjith's layering: giant `Channakeshava Gowda`
   type with the robot standing in front of it.
4. **Mono micro-labels** for every section eyebrow (`about`, `experience`…) — lowercase per
   Phase A.
5. **Sections as events** — deliberate tonal shifts, hairline rules, big whitespace.
6. **Motion:** eased arrivals, a scroll-drawn orange line as the signature interaction,
   robot breathing/parallax. No bounce. Reduced-motion honored.
7. **Type:** one strong family + one mono. (Resisting Daylight's serif+sans+mono mix to stay
   disciplined — revisit only if the hero needs an editorial serif.)

---

## ▮ REVIEW C — DECISIONS LOCKED (2026-08-10)

1. ✅ **Art-direction statement approved as written.** "A well-made instrument sitting in warm
   afternoon light" is the governing vision for every downstream phase.
2. ✅ **Base color: warm cream** (Daylight-style, ~`#F8EFDE` territory). Not near-white. This
   is what makes the orange read warm and premium rather than alarming. Ink = soft near-black.
3. ✅ **Signature interaction: the scroll-drawn orange line — BUILD IT.** A thin orange
   line/diagram that draws itself as the user scrolls (anchored to the Experience timeline).
   Rationale: nods to distributed systems, uses orange as a *signal*, delightful but calm, and
   it's distinctly CG's rather than borrowed. Spec'd in Phase H, built in Phase M2.

**Phase C is closed.** Next: Phase D — CG brand foundation (wordmark, robot mascot role,
icon motif derived from the robot, microcopy voice samples).

### Carry-forward requirements
- **Robot image file needed on disk** before Phase K (currently only shared in chat). At that
  point, sample its true orange and let **the robot define the accent hex**.
- Phase E must produce: cream base ramp, ink ramp, the accent in the `#F2673A`–`#FF6B35` band
  with hover/active states, hairline border token, and WCAG AA validation for every text pair.

# 2C — Hero specs

Status: **accepted 2026-11-02** (review changes folded in below).
Scope: the six items in `ART_DIRECTION.md` §8. Game logic, odds, economy, unlock
rules and the save format are untouched.

Changes accepted in review: shorter C/D reveal, ROLL unblocked mid-reveal, fluid
fountain shell, two empty states first, droplet-only wordmark, frame tokens with a
four-frame fallback, and a dev-only state fixture so the rare states can be seen.

---

## 0. Guardrails these specs must satisfy

| Rule | Consequence here |
|---|---|
| No `backdrop-filter`, no blurred viewport layers | every effect is a transform, opacity, or a 1px line |
| Reduced motion | one 120ms opacity fade replaces the whole reveal; frames and water static |
| Animations never block input | transform/opacity only; no element gains `pointer-events: none`; ROLL is re-enabled **300ms** into the reveal |
| No text under 11px | every new label is ≥11px |
| Uppercase only for ROLL / CLAIM / primary / stamps | all new labels are sentence case |
| 8px chamfer = frosted panels + modal only | card frames keep their own 18px radius |
| No fake data | water level, tier numeral and counts all read from state |

Colour stays a tier *edge*, never the only carrier of the frame.

---

## 1. Motion tokens (one place, `src/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | card enters, droplets fall |
| `--ease-turn` | `cubic-bezier(.16, 1, .3, 1)` | the Y-axis turn |
| `--ease-stamp` | `cubic-bezier(.34, 1.56, .64, 1)` | tier stamp only (the one overshoot) |
| `--t-fast` | `120ms` | fades, key travel |
| `--t-beat` | `180ms` | a single beat |
| `--t-settle` | `260ms` | stamp settle |

House rule: **one loop in the app** — the active rail icon. Everything else is
one-shot. Water waves are the only other exception, and they stop under reduced
motion.

---

## 2. Roll reveal, frame by frame

Current behaviour: `doRoll` waits **260ms** while the card dims (`.hero.rolling`
→ `scale(.975)`, `brightness(.78)`), then the card is replaced and plays
`reveal` (rotateY +55° → 0, 350–850ms by tier).

Proposal: keep the press, replace the single animation with three beats, and make
the last beat tier-specific.

| t (ms) | Beat | Stage card | Controls | Notes |
|---|---|---|---|---|
| 0 | **press** | brightness `.78`, scale `.975` | ROLL key travels 4px | unchanged |
| 0–140 | **old card out** | opacity → 0 | — | swap moves from 260ms to **140ms** |
| 140 | **swap** | new card mounts at `rotateY(40deg)`, `opacity 0` | chip hidden | no layout shift; same 288×403 box |
| 140–320 | **turn** | rotateY → 0, opacity 0 → 1 over the first 180ms | — | `--ease-turn` |
| 240–620 | **specular** | one 1px frost line sweeps the top edge, left → right | — | 380ms, once, S+ and S only |
| **300** | **unblock** | — | **ROLL re-enabled** | the flourish finishes underneath |
| 560 | **stamp** | tier chip scales `92% → 100%` (`--ease-stamp`) + 1px ring pulse | — | no glow |
| 760–900 | **settle** | sweep fades to 0 | — | end state = steady card |

Per-tier length (total, from the swap):

| Tier | Total | Turn | Specular | Sparkles |
|---|---|---|---|---|
| S+ | **900ms** | 340ms | yes, 380ms | 5, 60ms stagger, once |
| S | 760ms | 300ms | yes, 300ms | — |
| A / B | 600ms | 260ms | — | — |
| C / D | **420ms** | 220ms | — | — |

- The turn angle drops from 55° to **40°** so the card never leaves its column.
- The new card is in the DOM and interactive at 140ms. Only ROLL waits, and only
  until 300ms — earlier than the end of every tier's reveal.
- Sparkles exist today as `.card-sparkles` (5 `<i>`); they become **one pass**
  instead of a loop.
- Reduced motion: swap at 0ms, `opacity 0 → 1` in 120ms, no turn, no sweep, no
  sparkles, chip instant, ROLL free.
- Keyboard: the roll key already exists; the reveal adds no listener.

Verification: from `pointerdown` on ROLL, the card reports `animationName: none`
within tier total + 40ms, and ROLL accepts a second press at 300ms.

---

## 3. Fountain hero

Goal: the basin is the tab's object; perks are the list under it.

**Layout at ≥1180px**

| Element | Today | Spec |
|---|---|---|
| Columns | basin 4/12, perks 8/12 | basin **5/12** (min 380px), perks 7/12 |
| Shell height | 148px fixed | **`clamp(200px, 13vw, 260px)`** |
| Title block | `fountain 1/12` + `tier 1 · basins filled` | keep, numeral separates (§ below) |
| Next-basin plate | right of the title | moves **under the shell**, right-aligned |

**The shell**

- Bowl silhouette kept (radius `12px 12px 42% 42% / 12px 12px 26% 26%`), etched
  fill, rim shadow, lit floor.
- **12 rim notches** along the top inner edge: 5×4px, 2px gap, 10px inset, square.
  Empty = cut (dark inner shadow), full = water (frost, 1px top light).
- **Water line**: 1px `rgba(226,246,255,.85)` at `filled / 12`, with an 8px
  meniscus band (2px dash, 6px gap) sliding 40px over 3.6s — the only loop.
- Below the surface: frost gradient `rgba(154,217,255,.5)` → `rgba(90,150,190,.14)`.
  No glow.
- **Tier numeral**: `tier 2` in Bakbak 40px inside the bowl's lower band; count
  `9 / 12` at 20px beside it. One line under the water, not above the bowl.
- **Dry state (0/12)**: etched floor only, 40% contrast, `dry` at 12px under the
  numeral. No water line, no wave.

**Droplets on purchase** (one-shot, ≤760ms)

1. key press → `buildFloor` (existing)
2. three 3px droplets spawn at the spout mouth (`50%`, top of the shell), fall to
   the new surface, staggered 80ms, `--ease-out`
3. on impact each draws a 1px ring expanding to 24px over 220ms, fading out
4. runs once — never on mount, never on tab change

**Perks demoted**

- 2 columns, 44px rows, price 13px, label 12px, blurb 11px on one line (copy pass
  trims the two longest).
- Keep the affordable gold base edge. No ring; hover only lifts the fill.

---

## 4. Per-tier card frames

The frame *is* the tier: each tier differs in **edge geometry and weight**, not
just hue. Applied to the stage card (288px), album tiles (168px) and the
inspector sheet. Card frames keep their 18px radius; the 8px chamfer stays a
frosted-panel device.

| Tier | Edge | Inner line | Specular | Motion |
|---|---|---|---|---|
| **S+** foil-ice | 1px yuzu at 85% | 2px light along the top edge | one 380ms sweep | 5 sparkles, one pass |
| **S** grape bevel | 1.5px grape at 70% | 1px dark line inset 3px, full frame | none | — |
| **A** ramune seam | 1px ramune at 60% | 1px seam inset 10px, **left edge only**, 24px tall | none | — |
| **B** melon etched | 1px melon at 40% | 2px top inner shadow (cut, not drawn) | none | — |
| **C** plum matte | none | 1px plum at 22%, top edge only | none | — |
| **D** slush plain | none | 1px `--line` at the bottom edge only | none | — |

**Implementation: tokens, not overrides.** One `--frame-edge` / `--frame-inner` /
`--frame-inset` triple consumed by a single `box-shadow` + `::before` pair. Each
tier sets tokens only. This is the rule that stops `styles.css` growing another
append-only block per surface.

**Fallback.** If C and D are not distinguishable in the grayscale test at 168px,
ship **four** frames — S+ / S / A-B / C-D — rather than six near-identical ones.

**Status 2026-11-02 — test failed, decision pending.** First implementation (outer
ring + inner lines) fixed a real bug — the tier ring was an inset shadow on
`.card3d-inner`, i.e. painted *under* the full-bleed portrait, so it was never
visible, and neither was the starwish ring. With the ring moved to the card box
and thickened to 2–3px, S+ and S are distinguishable, but **A/B/C/D are not** at
186px in grayscale: C and D have no ring at all and their 2px inner line
disappears where the art is dark. Edge weight alone cannot carry six tiers over a
full-bleed image. Three options, none chosen yet:

1. **Mat** — a 6px inset band of card surface around the art; the tier lives in
   the mat (foil strip, groove, seam, etched lip). Gives the frame area; changes
   the card composition slightly.
2. **Corner vocabulary** — one corner treatment per tier (cut, rounded, notched,
   square, half-cut, plain). Survives grayscale without touching the art area.
3. **Four frames** — S+ / S / A-B / C-D, which still fails for A vs B and C vs D
   with edges alone unless combined with 1 or 2.

Rules:

- Tier colour never appears as fill, wash or glow on the frame — edge and line
  only.
- Grayscale test: with hue removed, the frames must be distinguishable at 100%
  by edge weight and placement alone.
- The existing inner 1px `rgba(255,255,255,.12)` frame at `inset: 6px` is
  **replaced**, not stacked.
- Starwish / soulmate keep their signal ring; that state outranks the tier frame.

---

## 5. Illustrated empty states

Authored SVGs, 1.5 stroke, butt terminals, one 30% facet, ink + frost. No text
inside the drawing; the sentence stays below it.

| Order | Where | Drawing | Size |
|---|---|---|---|
| 1 | Stage, no current roll | card back: the diagonal weave, one corner cut | 180×252 |
| 2 | Wishes, no starwish | empty plinth: stand + crescent shadow | 120×160 |
| — | Loot, sealed | the crate, lid seam and clasp only | 140×120 |
| — | Fountain, 0/12 | dry bowl: rim notches, etched floor, no water | 220×140 |

The two deferred ones land after 2C if time survives; both states already read
correctly today.

---

## 6. Wordmark

- **Droplet mark only** for 2C: 12×16, one facet, 8px gap before the word.
- The word stays **Instrument Serif** as set today. Hand-cut letterforms as paths
  are a separate, later decision — they are large to review and touch every
  header capture.
- The mark doubles as the favicon at 32px.
- No webfont request added.

---

## 7. Rail

Decided and live: **variant B, no dot**, 2px bar, active icon lit in frost
`#9ad9ff`. 2C-c is a verification pass (1440/1772, active/hover/focus), not a new
contact sheet.

---

## 8. Sound

Blocked. No assets until file sizes and licences are provided. When they are: off
by default, Settings toggle, no autoplay, ROLL / CLAIM / purchase only.

---

## 9. Dev state fixture (new)

Three in-memory states reachable by URL, **dev builds only**:

| URL | State |
|---|---|
| `?state=empty` | first run: no roll, no starwish, sealed loot, dry basin |
| `?state=mid` | bronze lit + silver ready, 5/12 basin, loot still sealed, 2 wishes |
| `?state=late` | all 7 medals at Lv 1, 12/12 basin, loot unlocked, 4 wishes, starwish set |

Rules:

- Built through the existing `hydrate()` so it can never contain an unknown id.
- **Never written to `localStorage`**; reloading the URL rebuilds it.
- Guarded by `import.meta.env.DEV`; absent from production builds.
- A fixed `fixture · <name>` chip renders bottom-left while a fixture is active,
  so no screenshot can be mistaken for a real save.

This is what lets 2B's unverified states (unlocked crate, empty plinth, lit/ready
medal mix) close before 2C signs off.

---

## 10. Acceptance checklist

- [ ] Reveal total per tier ≤ spec +40ms, measured from pointerdown to last animation
- [ ] ROLL accepts a second press at 300ms
- [ ] Reduced motion: no rotation, no sweep, no sparkles, 120ms fade only
- [ ] Frames pass the grayscale test at 100% (or the four-frame fallback ships)
- [ ] Fountain shell fluid, 12 notches, water line tracks state exactly
- [ ] Droplets fire once per purchase, none on mount or tab change
- [ ] Fixture reaches empty / mid / late, and `localStorage` is byte-identical after
- [ ] 0 `backdrop-filter`, 0 text under 11px, 0 horizontal overflow at 1440/1772
- [ ] No odds, economy, unlock or save-format change in the diff

---

## 11. Still open

1. Wordmark lettering: later, or never?
2. Deferred empty states: after 2C, or drop them?

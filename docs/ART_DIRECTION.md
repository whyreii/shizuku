# Shizuku — Art Direction

**Status:** Phase 2A, revised after owner review. Nothing in the app's visual styles changes until this is approved.
**Scope:** the app shell (React + one `styles.css`). `docs/` is not imported by `src/` and `tsconfig.app.json` includes only `src`, so this folder never reaches the bundle.

## 0. Binding rules

1. **No `backdrop-filter` anywhere.** Three exist today and all are removed in Phase 2B: `.modal-backdrop` (`styles.css:1103`, `blur(6px)`), the dead `.help-fab` (`styles.css:2591`, `blur(8px)`), and `preview4.css:1694` (`blur(12px)`). The modal scrim becomes an opaque ink wash.
2. **No `filter: blur()` on full-viewport layers.** The only blur allowed is `drop-shadow` on a medal wrapper.
3. **Reduced motion** for every new animation (`prefers-reduced-motion: reduce` → instant state).
4. **Animation never blocks input.** All motion runs on pseudo-elements/overlays with `pointer-events: none`; game handlers never wait on `animationend`.
5. **Titles and names keep capitals. All other microcopy is lowercase.** Uppercase is reserved for ROLL, CLAIM, primary buttons and stamps.
6. No new dependencies. Icons and the grain tile are authored in-repo.

## 1. Materials — three surfaces, nothing else

| Surface | Recipe | Used on | Replaces |
|---|---|---|---|
| **Frosted ice** | translucent cool pane; 1px light only along the top edge, 1px shadow along the bottom; fine vertical striation; 5% grain; **8px chamfer on the top-right corner**; no outer glow, no uniform ring | modals, Settings sheet, Ripples rows, perk tiles, wish cards, album/series info bands | the white-5% fill + inset ring + soft gradient on every block |
| **Etched ice** | recessed: darker than its surround; top edge in shadow, bottom edge catches light; matte | empty wish slots, basin interior, medal wells, spent keys, inputs | dashed holes, disabled pills, grey slots |
| **Gold hardware** | one warm metal; hard top light; 3px dark base edge; engraved label; no glow | ROLL, CLAIM, primary button, price tags, next-basin tag | gold used as a glow on cards and chips |

**Syrup is colour only, never a surface.** It appears in tier edges, the room wash, medal tints, pips and the rail's active marker.

The **8px chamfer** is deliberate and measurable at 100% (field check in the palette study). It applies to frosted panels and the modal; etched surfaces keep square corners.

## 2. Palette

Swatches and the gold-vs-S+ comparison: `docs/art-direction-palette.png`.

![palette study](art-direction-palette.png)

### Base surface — two options, navy is retired

| | Page | Panel | Raised | Line | Why |
|---|---|---|---|---|---|
| **A · Charcoal Sea** *(recommended)* | `#0b0c0b` | `#141614` | `#1e211e` | `#2a2e2a` | neutral warm-black; frost reads cool, gold reads warm; the syrup ladder carries all the colour |
| **B · Ink Violet** | `#08070f` | `#100e1a` | `#191627` | `#262238` | purple-black night; ties to grape/plum, but competes with tier C |

Body text `#cdd9e5` (13.7:1 on A, 14.0:1 on B); muted `#a6b9cc` (9.7:1 / 10.0:1).

### Syrup ladder

| Tier | Syrup | Hue | On ink | Chip text (hue 42% → white) | Chip on ink |
|---|---|---|---|---|---|
| S+ | **yuzu** | `#e4f0a8` | 16.2:1 | `#f4f9da` | 18.1:1 |
| S | grape | `#c3a8ff` | 9.8:1 | `#e6daff` | 14.9:1 |
| A | ramune | `#8cc8ff` | 11.2:1 | `#cfe8ff` | 15.7:1 |
| B | melon | `#6fe3b4` | 12.6:1 | `#c3f3e0` | 16.2:1 |
| C | **plum** | `#b98bb8` | 7.0:1 | `#e2cee1` | 13.4:1 |
| D | **slush** | `#7a8c9c` | 5.7:1 | `#c7cfd5` | 12.6:1 |

**S+ is no longer gold.** `#e4f0a8` is a pale yuzu-green: **ΔE 31.4** from the action gold `#f7c667` (the old `#ffd98a` was ΔE 11.9 — too close to be a separate identity). The S+ card frame gets that hue plus a white specular edge, so "top tier" reads as foil-ice, never as a button.

**Gold stays for actions only** (`#f7c667`, ink label `#2a1a04`, 10.6:1). Rationale: it is the sole warm metal; using it as a card tint is what flattened the hierarchy.

**Small text target:** every tier label, price and chip is ≥4.5:1 against its own backing. D is lifted from `#62717f` to `#7a8c9c` so it reads as ice rather than shadow.

## 3. Icons — one hand

**Inventory to redraw (16 + 7):**
- Rail: album, wishes, medals, fountain, loot, series, ripples.
- Header/currency: kakigori, rolls, shard, crystal, clock, gear.
- Actions: lock, wish/star, power.
- Medal glyphs: sleet, hail, glaze, frost, blizzard, glacier, aurora.

**Hand:** "carved ice" — 1.5px weight, **flat-cut (butt) terminals**, 2px corner radius on a 24 grid, built on two primitives (hex cell, droplet) with one deliberate cut per glyph. No round caps, no mixed weights.

**Rail drop:** the proposal adds a filled syrup drop at 20px. The contact sheet renders **two variants** — drop on all seven, and drop only on the active tab (2px frost bar stays in both). If the drop adds clutter at 20px, the fallback is no drop.

**Contact sheet gate:** author in `src/iconDrafts.tsx` (not wired), render at **16 / 24 / 48px on ink and on frost**, plus the two rail variants, and wait for approval. If any glyph is illegible at 16px, that glyph falls back to rounded terminals — not the whole set.

## 4. Typography

**Keep:** Bakbak One (display, numbers, timers) and Instrument Serif (card names, wordmark).
**Approved body:** **Zen Kaku Gothic New** (SIL OFL 1.1, Latin subset, 300/400/500/700/900, 10 kB Latin woff2 at 400). It replaces Archivo.

**Digits:** Zen Kaku's figures are proportional and the family does **not** expose `tnum` — measured in-browser: `1111111111` = 186.6px and `0000000000` = 200.0px, identical with and without `font-variant-numeric: tabular-nums`. Therefore:
- **Timers, counters, prices, stat rows stay in Bakbak One** (already the house rule for numbers).
- Body prose keeps Zen digits; no tabular attempts.

Dropping the three preview-only families from `index.html` offsets the new body font.

## 5. Texture

- **Grain:** one pre-rendered **64×64 PNG** (generated once, committed), repeated at **5% opacity** on frosted surfaces only. **Field test at 100% zoom:** if it is invisible on the actual panel, raise to 7% in 1% steps; if still invisible, drop grain rather than add noise to the whole viewport.
- **Frost edge:** 1px top light, 1px bottom shadow, 8px top-right chamfer. No blend modes, no full-viewport layers.

## 6. Motion (150–300ms, opt-out, non-blocking)

| Moment | Motion | Spec |
|---|---|---|
| ROLL | ripple ring from the key | 2px ring, scale 1→1.6, opacity .5→0, **260ms** ease-out, overlay `pointer-events:none` |
| CLAIM | ring from the stamp corner | **220ms**, one-shot |
| Purchase | ring on the perk tile + stack notch lights | **180ms** |
| Card reveal | frost overlay fades, art settles 1.02→1 | **240ms**, no blur filter |

**Input test:** with a reveal playing, a second ROLL must start on the same click. Verified in the seeded profile (never the real save).

## 7. Copy

Rules: titles and names keep capitals; every other string is lowercase; no exclamation; no "let's"; ≤14 words; prices bare; uppercase only on ROLL / CLAIM / primary / stamps.

| Now | Revised |
|---|---|
| `roll to draw` | `nothing drawn yet` |
| `the plinth is empty` / `Wish a character…` | keep the first; `pick one in series — it takes the stand` |
| `No cards claimed yet.` | `no claims yet` |
| `Nothing matches.` | `no match` |
| `Nothing opened yet.` | `nothing pulled yet` |
| `turn each of these medals once` | `raise Frost, Blizzard and Glacier to Lv 1` |
| `yours only, saved locally` | `this browser only` |
| `how it works` | `the rules` |
| `No starwish set` | `no starwish` |
| `drain fountain · refund 5,000` | `drain · 5,000 back` |
| `maxed` | `full` |
| `sealed / locked / built` | keep |

## 8. Phase 2C

**I did not receive a 2C section.** The six items named in your review are included here; if 2C carried specifics (order, references, constraints), resend them and I will fold them in before building.

| Item | Proposed direction | Lands |
|---|---|---|
| **Per-tier card frames** | frame is the tier: S+ foil-ice edge + specular; S grape bevel; A ramune seam; B melon etched; C plum matte; D slush plain. No colour-only frames. | surfaces pass |
| **Fountain hero** | the basin becomes the tab's hero (larger shell, 12 rim notches, water line, tier numeral), perks secondary. | surfaces pass |
| **Wordmark** | custom "Shizuku" lettering (Instrument Serif base, hand-cut terminals) as an inline SVG; header + favicon. | after icons |
| **Illustrated empty states** | authored SVG, not text: card back on the stage, empty 10-slot rack, dry basin, sealed box. One drawing hand, ink + frost. | surfaces pass |
| **Two rail alternatives** | A) current 72px floating keys; B) 148px labelled rail with the 2px marker. Contact sheet renders both before choosing. | before surfaces |
| **Optional sound** | ROLL / CLAIM / purchase cues, **off by default**, toggle in Settings, no autoplay, no dependency (WebAudio or `<audio>` with tiny assets). | last, opt-in |

## 9. Build order and gates

1. Icons in `src/iconDrafts.tsx` → contact sheet (16/24/48, ink/frost, rail A/B) → approval.
2. Surfaces + texture + chamfer (base palette A or B).
3. Tier colours + per-tier frames.
4. Motion (four moments).
5. Copy.
6. Type (Zen Kaku) last, after the surface pass settles.
7. Phase 2C items in the order above.

Each step: `npm run build`, `npm run lint` (0 errors), 1440 + 1772 sweep, 0 text under 11px, timer format unchanged, reduced-motion pass, input-during-animation pass.

## 10. Open questions

1. **Base palette:** A Charcoal Sea (recommended) or B Ink Violet?
2. **2C:** please resend the section; I only have the six item names.
3. **Sound:** off by default (my assumption) — confirm.
4. **Chamfer scope:** frosted panels + modal only, or also the stage card frame?

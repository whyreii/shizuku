# Shizuku — Roadmap

A single-player, Mudae-inspired character gacha. **Shizuku** is the app; **kakigori**
is the currency.

## Locked decisions

- Single-player web app, no accounts, no server.
- App name **Shizuku**; currency **kakigori**.
- Cadence: **10 rolls per hour**, **60s claim window**, **2h claim cooldown**.
- **Claiming pays nothing.** Ownership is an asset; **divorce** refunds the card's
  value (21+ keys lose 5% of keys).
- Income = crystals + keys (+12/hr each) + power (+3/hr per level) + daily + loots.
- **Power is derived**: `floor(total keys / 10)` — a progress stat, not a purchase.
- Sinks in Mudae order: **badges → tower → loots → boosts**. The Shop tab is retired.
- Badge tiers are ice: **Sleet · Hail · Glaze · Frost · Blizzard · Glacier · Aurora**.
- Roster: hand-ranked 1,000 keep ranks 1–1000; AniList extras append by favourites.
  **6,225 characters across 725 series are live**; a full uncapped capture (25k–50k)
  is still pending.
- Rarity: extras currently weigh 5 each. Before the full run they switch to a fixed
  **40% share** of pool weight so the ladder cannot become unobtainable.
- Shell: one column, hairline chrome, serif display + mono numbers; only cards round.

## Status

| # | Phase | State |
| - | ----- | ----- |
| P0 | Foundation | ✅ |
| P1 | Rename → Shizuku | ✅ |
| P2 | Card v3 — cover art, double frame, patch flags, skeleton | ✅ |
| P3 | Cadence — 10 rolls/hour · 60s · 2h | ✅ |
| P4 | Crystals | ✅ |
| P5 | Collection index + character sheet | ✅ |
| P6 | Divorce refund + shatter animation + undo | ✅ |
| P7 | Modals — confirm, settings, help | ✅ |
| P8 | QOL — export/import, keyboard, claim bar, reduced motion | ✅ |
| P9 | Help FAB | ✅ |
| P10 | Badges — 7 ice tiers × IV | ✅ |
| P11 | Shop removal · derived power · daily relocated | ✅ |
| P12 | Performance — bundle split, windowed lists, image pipeline | ✅ |
| P13 | **Roster capture** — 6,225 live; full uncapped run pending | ⏳ |
| P14 | Tower — 12 floors, +5,000 each | ✅ |
| P15 | Lootboxes | ✅ |
| P16 | Series index + per-series modal | ✅ |
| P17 | Wishes — wishlist, starwish, boost, wish-a-series | ✅ |
| P18 | Media — galleries live; 12 slots and GIFs never specified | partial |
| P19 | Personalization — alias + note, image override, 2 wish presets | ✅ |
| P20 | Settings knobs — novelty + save transport live | partial, rest unspecified |
| P21 | Progression UI | unspecified |
| P22 | Ship | — |

## Performance work (P12)

Done:
- Portrait **warm cache**: a resolved URL is decoded into an `Image()` immediately and
  re-warmed on every cache hit, so repeat rolls paint instantly.
- `decoding="async"` + `fetchPriority="high"` on the hero card image.
- **Prefetch** of the wishlist and the first 24 owned portraits on boot.
- Skeleton shimmer while a portrait resolves.

Next:
- Done: windowed lists mount ~30 rows (725 series -> 28 rows).
- Portraits only for visible rows.
- `React.memo` rows; scroll handler on `requestAnimationFrame`.
- Isolate the 1-second clock from panel re-renders.
- Done: roster loads from `/public/roster-extra.json`; bundle 811 KB → **291 KB**.

## Rarity

```
EXTRA_WEIGHT = (share / (1 - share)) × baseWeight / extraCount     // share = 0.4
```

| Pool | Top-10 card | Top-50 band |
| ---- | ----------- | ----------- |
| 1,000 (base) | 0.011% | 0.95% |
| 6,225 (live) | 0.004% | ~0.34% |
| ~40k (full) | ~0.0068% | ~0.6% |

## Known gaps

- Full roster capture not run yet (needs a clean cache; the current one is capped at
  60 characters per series).
- No automated tests around economy constants.
- P18's media slots/GIFs and P21 were never specified, so they cannot be scoped.
- Keyboard shortcuts and the shatter animation are wired but not measured end-to-end.

## Out of scope

Moderation/admin commands, premium gating, trading, multi-server copy, custom
character creation, Discord-only mechanics (sniping, rush hours, instances).

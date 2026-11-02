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
  **50,845 characters are live** (full capture over 2,667 series).
- Rarity: the raw rank ladder is in use. The fixed **40% extras share** was never
  built, so with 49,845 extras the tail carries most of the weight and the top cards
  are far rarer than the ladder intends — the share switch has to land before the
  odds can be defended.
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
| P13 | **Roster capture** — 50,845 live (1,000 hand-ranked + 49,845 extras over 2,667 series) | ✅ |
| P14 | Tower — 12 floors, +5,000 each | ✅ |
| P15 | Lootboxes | ✅ |
| P16 | Series index + per-series modal | ✅ |
| P17 | Wishes — wishlist, starwish, boost, wish-a-series | ✅ |
| P18 | Media — galleries with no cap, GIFs by URL | ✅ |
| P19 | Personalization — alias + note, image override, 2 wish presets | ✅ |
| P20 | Settings knobs — novelty, wish boost, save transport, wipe | ✅ |
| P21 | Progression UI — rolls/claims/shards line shipped; dashboard never specified | dropped |
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

The ladder is rank-based, not weighted per pool: `weightForRank(rank)` reads
`poolPerCard(poolIndex(rank))`. It was tuned for a ~6k pool, where the pools cover the
whole roster and sum to 100%. At 50,845 the last edge is 17,366, so 33,479 cards fall into
the final pool on their own: the real weight sums to **320.86**, and a rank-1 card is
about 1 in 16,000,000 rolls. The fixed 40% extras share is the fix; until it lands the
odds lean heavily toward the tail.

## Known gaps

- The 40% extras share is not implemented, so the roll odds lean toward the tail
  (see Rarity).
- No automated tests around economy constants.
- P22 needs a host.
- Keyboard shortcuts and the shatter animation are wired but not measured end-to-end.

## Out of scope

Moderation/admin commands, premium gating, trading, multi-server copy, custom
character creation, Discord-only mechanics (sniping, rush hours, instances).

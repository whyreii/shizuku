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
- Rarity: the draw is **uniform** — every rollable card is `1 / pool size`. The pool
  is fixed at the top **7,000** of the roster (Mudae's `$limroul` default); a tier
  sets a card's **value**, never its odds.
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

Uniform draw: every character you can roll has the same chance, `1 / pool size`.
That is Mudae's model — a tier sets a card's **value**, never its odds.

Rarity comes from the pool size, Mudae's `$limroul` at its default: the top **7,000**
of the ranked roster. It is a fixed constant, not a setting. A smaller pool is
strictly better (duplicates scale as `1 / pool`), so offering the player a choice
was an upgrade rather than a trade — every save would sit at the minimum. Fixed at
7,000 keeps the comparison honest and leaves composition as the only thing the
player controls.

Wishes, the starwish and every card you already own bypass the 7,000 and join the
pool the way `$antidisable` works — added, not carved out, so they dilute everything
else slightly.

At 7,000 the ladder reads: a specific card is **1 in 7,000** (700 h at 10 rolls/hr),
the S+ band (ranks 1–10) is 0.14% of rolls, D (701–7,000) is 90%. A 30-day save
lands around 54 duplicate rolls and 5,877 kakigori/hr.

## Known gaps

- Lootboxes never touch the pool: Mudae's loots shave limits too, but `LOOT_COST`
  is 1,000 against a ~12,000/hr income, so loot-gated steps would be nearly free.
- No automated tests around economy constants.
- P22: host chosen (Cloudflare Pages, unlimited bandwidth); deployment deferred by the owner.
- Keyboard shortcuts and the shatter animation are wired but not measured end-to-end.

## Out of scope

Moderation/admin commands, premium gating, trading, multi-server copy, custom
character creation, Discord-only mechanics (sniping, rush hours, instances).

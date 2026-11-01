import {
  CLAIM_WINDOW_MS,
  starwishMultiplier,
  wishMultiplier,
} from "../engine/game";
import type { GameState } from "../engine/types";

/** The "how it works" copy, shared by Settings and the legacy guide panel. */
export function sections(
  state: GameState,
): { title: string; lines: string[] }[] {
  return [
    {
      title: "the loop",
      lines: [
        `roll -> claim within ${Math.round(CLAIM_WINDOW_MS / 1000)}s -> divorce for value`,
        "claiming costs nothing but a 2h cooldown between claims",
        "divorce pays the card's value and releases it",
      ],
    },
    {
      title: "kakigori",
      lines: [
        "crystals only spawn when you roll a card you already own",
        "40% base chance, 6s to click, 90s between spawns",
        "values: purple 100 → rainbow 3,000",
      ],
    },
    {
      title: "shards",
      lines: [
        "every roll of an owned card adds a key — no cooldown",
        "up to 500 shards per character",
        "+10% value at levels 2/4/5/7/8/9, +5% each level from 11",
        "10 shards makes the card a soulmate",
      ],
    },
    {
      title: "wishes",
      lines: [
        wishMultiplier(state) <= 1
          ? "no wish boost yet - Silver earns it"
          : `wished cards are ×${wishMultiplier(state).toFixed(1)} more likely, not guaranteed`,
        starwishMultiplier(state) <= 1
          ? "no starwish boost yet - the Fountain earns it"
          : `one starwish carries ×${starwishMultiplier(state).toFixed(1)} weight`,
        "wish holds strongest cards first — check the cap",
      ],
    },
    {
      title: "badges",
      lines: [
        "seven ice tiers, four levels each",
        "costs follow Mudae: level × base, cumulative",
        "higher tiers need the lower ones (or any two at IV)",
      ],
    },
    {
      title: "fountain",
      lines: [
        "12 basins per fountain, one perk per basin",
        "each floor costs 5,000 more than the last",
        "destroy refunds everything you spent",
        "the 13th build starts a second fountain",
      ],
    },
    {
      title: "collection",
      lines: [
        "the board keeps list and grid views",
        "the eye toggle hides labels so the art reads clean",
        "series rows open an index you can wish from",
      ],
    },
    {
      title: "save",
      lines: [
        "everything is local to this browser",
        "export a save before wiping or switching machines",
      ],
    },
  ];
}

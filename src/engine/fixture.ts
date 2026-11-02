// Dev-only sample saves, reachable as ?state=empty | mid | late.
//
// Why this exists: several states (unlocked loot crate, empty plinth, lit/ready
// medal mix, a full basin) cannot be reached without playing for hours, and the
// house rule forbids seeding the real save to get them. These states are built
// in memory instead.
//
// Guarantees:
// - built through hydrate(), so an unknown roster id can never enter
// - never written to storage (store.ts skips persistence while one is active)
// - absent from production builds (import.meta.env.DEV is folded to false)
import { createInitialState, hydrate } from "./game";
import type { GameState, LogLine } from "./types";

const NAMES = ["empty", "mid", "late"] as const;
export type FixtureName = (typeof NAMES)[number];

export function fixtureName(search: string): FixtureName | null {
  const name = new URLSearchParams(search).get("state");
  if (!name) return null;
  return (NAMES as readonly string[]).includes(name) ? (name as FixtureName) : null;
}

export function fixtureFromSearch(search: string, now: number): GameState | null {
  if (!import.meta.env.DEV) return null;
  const name = fixtureName(search);
  return name ? build(name, now) : null;
}

function owned(ids: string[], at: number): GameState["owned"] {
  const out: GameState["owned"] = {};
  ids.forEach((id, i) => {
    out[id] = { charId: id, claimedAt: at - i * 60_000, soulmate: false };
  });
  return out;
}

function keyed(ids: string[], keys: number, at: number): GameState["keys"] {
  const out: GameState["keys"] = {};
  for (const id of ids) out[id] = { keys, lastKeyAt: at };
  return out;
}

function log(lines: Array<[string, LogLine["tone"]]>, now: number): LogLine[] {
  return lines.map(([text, tone], i) => ({
    id: `fixture-${i}`,
    at: now - i * 90_000,
    text,
    tone,
  }));
}

const MID_OWNED = ["r001", "r002", "r003", "r004", "r005", "r006"];
const LATE_OWNED = [
  "r001", "r002", "r003", "r004", "r005", "r006",
  "r007", "r008", "r009", "r010", "r041", "r947",
];

function build(name: FixtureName, now: number): GameState {
  if (name === "empty") return createInitialState(now);

  const late = name === "late";
  const ownedIds = late ? LATE_OWNED : MID_OWNED.slice(0, 3);

  const state = hydrate({
    kakigori: late ? 148_000 : 6_200,
    rolls: late ? 10 : 6,
    lastAccrual: now,
    nextClaimAt: 0,
    power: late ? 4 : 0,
    owned: owned(ownedIds, now),
    keys: keyed(ownedIds.slice(0, late ? 4 : 2), late ? 6 : 2, now),
    wishes: late
      ? ["r002", "r003", "r004", "r005"]
      : ["r002", "r003"],
    starwish: "r001",
    soulmateId: late ? "r002" : null,
    badges: late
      ? { bronze: 1, silver: 1, gold: 1, sapphire: 1, ruby: 1, emerald: 1, diamond: 1 }
      : { bronze: 1, silver: 0, gold: 0, sapphire: 0, ruby: 0, emerald: 0, diamond: 0 },
    tower: late
      ? { floors: 12, perks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], spent: 240_000 }
      : { floors: 5, perks: [1, 3, 6], spent: 25_000 },
    upgrades: late
      ? { rolls: 2, claims: 1, wishes: 1, keys: 1 }
      : { rolls: 1, claims: 0, wishes: 0, keys: 0 },
    stats: late
      ? { rolls: 240, claims: 12, keys: 40 }
      : { rolls: 18, claims: 2, keys: 3 },
    log: log(
      late
        ? [
            ["claimed ★ Hatsune Miku", "claim"],
            ["rolled #947 Osaragi", "roll"],
            ["key drop · 2 shards", "key"],
            ["built basin 12", "info"],
            ["wish spawned", "wish"],
            ["claimed #41", "claim"],
          ]
        : [["rolled #3", "roll"], ["claimed #1", "claim"], ["built basin 5", "info"]],
      now,
    ),
  });

  // hydrate() always clears the live roll, so set it after.
  state.current = {
    charId: late ? "r947" : "r007",
    rolledAt: now,
    claimed: false,
    keyed: late,
  };

  return state;
}

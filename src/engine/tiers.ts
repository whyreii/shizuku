import type { Tier } from "./types";
import { ROSTER_SIZE } from "./roster";

/**
 * Uniform draw. Every card you can roll carries the same weight, so its chance
 * is simply 1 / pool size, the way Mudae hands out spawns. Rarity is not a
 * property of the rank: it comes from the pool filter (`poolCap`), Mudae's
 * limroul lever. A smaller pool makes every card left in it likelier.
 */
export const MAX_SHIFTS = 6;

/** Rarity lens: each shift adds this much weight to the curated S+/S cards. */
export const SHIFT_SP = 0.1;
export const SHIFT_S = 0.05;

export function clampShifts(shifts: number): number {
  if (!Number.isFinite(shifts)) return 0;
  return Math.max(0, Math.min(MAX_SHIFTS, Math.round(shifts)));
}

/** Draw weight for a rank. Flat 1, nudged up by rarity shifts on S+/S. */
export function weightForRank(rank: number, shifts = 0): number {
  const s = clampShifts(shifts);
  if (s <= 0) return 1;
  if (rank <= 10) return 1 + SHIFT_SP * s;
  if (rank <= 50) return 1 + SHIFT_S * s;
  return 1;
}

/** Uniform weights are relative; they are never summed to 100. */
export function totalWeight(): number {
  return 1;
}

export function invalidateWeightCache(): void {
  /* uniform weights need no cache */
}

/** 6 display tiers. The tier sets a card's value, not its odds. */
export function tierForRank(rank: number): Tier {
  if (rank <= 10) return "S+";
  if (rank <= 50) return "S";
  if (rank <= 150) return "A";
  if (rank <= 350) return "B";
  if (rank <= 700) return "C";
  return "D";
}

export interface BandRow {
  label: string;
  perCharacter: number;
  bandTotal: number;
  tier: Tier;
}

/**
 * One row per tier band. `cap` is the highest rollable rank; `total` is the
 * whole pool, which is larger when wishes bypass the cap.
 */
export function bandTable(
  shifts = 0,
  cap = ROSTER_SIZE(),
  total = cap,
): BandRow[] {
  const top = Math.max(1, Math.min(cap, ROSTER_SIZE()));
  const extra = Math.max(0, total - top);
  const s = clampShifts(shifts);
  const sPlus = Math.min(10, top);
  const sBand = Math.max(0, Math.min(50, top) - 10);
  const rest = Math.max(0, top - 50);
  const weightSum =
    sPlus * (1 + SHIFT_SP * s) + sBand * (1 + SHIFT_S * s) + rest + extra;

  const edges: [Tier, number][] = [
    ["S+", 10],
    ["S", 50],
    ["A", 150],
    ["B", 350],
    ["C", 700],
    ["D", top],
  ];
  const rows: BandRow[] = [];
  let start = 1;
  for (const [tier, edge] of edges) {
    const end = Math.min(edge, top);
    const count = end - start + 1;
    if (count <= 0) break;
    const per = weightForRank(start, shifts) / weightSum;
    rows.push({
      label: "#" + start + "\u2013" + end,
      perCharacter: per,
      bandTotal: per * count,
      tier,
    });
    start = end + 1;
  }
  return rows;
}

export function tierClass(tier: Tier): string {
  switch (tier) {
    case "S+":
      return "tier-sp";
    case "S":
      return "tier-s";
    case "A":
      return "tier-a";
    case "B":
      return "tier-b";
    case "C":
      return "tier-c";
    default:
      return "tier-d";
  }
}
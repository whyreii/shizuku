import type { Tier } from "./types";
import { ROSTER_SIZE } from "./roster";

/**
 * Geometric ladder. Pools double in size until they run out of roster, then the
 * last two are evened out so the deepest pool is the biggest one. Each step is
 * GROWTH more likely per character than the step above, so per-card chance
 * rises smoothly from rank 1 to rank 17,366 and never doubles back.
 */
export const POOL_EDGES = [10, 25, 50, 100, 200, 400, 800, 1600, 3200, 6400, 11000, 17366];

export const POOL_GROWTH = 1.115;

/** Extra per-card chance (in percentage points) each rarity shift adds. */
export const SHIFT_PER_CARD_PP = 0.003;

export const MAX_SHIFTS = 6;

/** Pools that rarity shifts touch: ranks 1-50, i.e. S+ and S. */
const SHIFTED_POOLS = 3;

export function poolIndex(rank: number): number {
  for (let i = 0; i < POOL_EDGES.length; i += 1) {
    if (rank <= POOL_EDGES[i]) return i;
  }
  return POOL_EDGES.length - 1;
}

export function poolStart(index: number): number {
  return index === 0 ? 1 : POOL_EDGES[index - 1] + 1;
}

export function poolSize(index: number): number {
  const end = Math.min(POOL_EDGES[index], ROSTER_SIZE());
  return Math.max(0, end - poolStart(index) + 1);
}

/** Per-card chance (percent) for pool 0, solved so the whole ladder sums to 100. */
function basePerCard(): number {
  let sum = 0;
  for (let i = 0; i < POOL_EDGES.length; i += 1) {
    sum += poolSize(i) * Math.pow(POOL_GROWTH, i);
  }
  return sum > 0 ? 100 / sum : 0;
}

export function clampShifts(shifts: number): number {
  if (!Number.isFinite(shifts)) return 0;
  return Math.max(0, Math.min(MAX_SHIFTS, Math.round(shifts)));
}

/** Total percentage points a shift adds, so the same amount leaves the tail. */
function shiftPoints(shifts: number): number {
  if (shifts <= 0) return 0;
  let added = 0;
  for (let i = 0; i < SHIFTED_POOLS; i += 1) added += poolSize(i) * SHIFT_PER_CARD_PP;
  return added * shifts;
}

/** Per-character chance (percent) for a pool, after shifts. */
export function poolPerCard(index: number, shifts = 0): number {
  const s = clampShifts(shifts);
  const base = basePerCard() * Math.pow(POOL_GROWTH, index);
  if (index < SHIFTED_POOLS) return base + SHIFT_PER_CARD_PP * s;
  if (index === POOL_EDGES.length - 1) {
    const size = poolSize(index);
    return size > 0 ? base - shiftPoints(s) / size : base;
  }
  return base;
}

/** Per-character chance as a probability (0..1). */
export function weightForRank(rank: number, shifts = 0): number {
  return poolPerCard(poolIndex(rank), shifts) / 100;
}

/** The ladder sums to 100%, so total weight is exactly 1. */
export function totalWeight(): number {
  return 1;
}

export function invalidateWeightCache(): void {
  /* derived on demand */
}
/** 6 display tiers stay as they are; the ladder above is the roll weighting. */
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

/** One row per ladder pool, in live odds. */
export function bandTable(shifts = 0): BandRow[] {
  const size = ROSTER_SIZE();
  return POOL_EDGES.map((edge, i) => {
    const start = poolStart(i);
    const end = Math.min(edge, size);
    const count = Math.max(0, end - start + 1);
    const per = poolPerCard(i, shifts) / 100;
    return {
      label: `#${start}\u2013${end}`,
      perCharacter: per,
      bandTotal: per * count,
      tier: tierForRank(start),
    };
  }).filter((row) => row.bandTotal > 0);
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

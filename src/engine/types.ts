export type Pool = "all" | "top" | "unclaimed" | "wished";
export type Tier = "S+" | "S" | "A" | "B" | "C" | "D";
export type SortKey = "rank" | "value" | "recent" | "series";

export interface Character {
  /** Stable key: the roster rank, e.g. "r001". */
  id: string;
  rank: number;
  name: string;
  series: string;
  /** The 💞 flag from the source list: already claimed. Design-time only. */
  heart: boolean;
  /** Portrait URL resolved at build time (extras ship one). */
  image?: string;
}

export interface KeyRecord {
  keys: number;
  lastKeyAt: number;
}

export interface OwnedRecord {
  charId: string;
  claimedAt: number;
  soulmate: boolean;
}

export interface CurrentRoll {
  charId: string;
  rolledAt: number;
  claimed: boolean;
  keyed: boolean;
}

export interface LogLine {
  id: string;
  at: number;
  text: string;
  tone: "roll" | "claim" | "key" | "power" | "wish" | "info";
  charId?: string;
  special?: "wish" | "starwish" | null;
}

export type UpgradeKey = "rolls" | "claims" | "wishes" | "keys";

export interface Upgrades {
  rolls: number;
  claims: number;
  wishes: number;
  keys: number;
}

/** Fountain: 12 basins per fountain, one perk each, refundable. */
export interface TowerState {
  floors: number;
  perks: number[];
  spent: number;
}

/** Per-character personalisation, keyed by rank id so roster updates never orphan it. */
export interface Override {
  alias?: string;
  note?: string;
  accent?: string;
  /** User-supplied image URLs for this character. */
  images?: string[];
}

export type BadgeKey =
  | "bronze"
  | "silver"
  | "gold"
  | "sapphire"
  | "ruby"
  | "emerald"
  | "diamond";

export type Badges = Record<BadgeKey, number>;

export interface WishPreset {
  id: string;
  name: string;
  wishes: string[];
  starwish: string | null;
  savedAt: number;
}

export interface GameState {
  version: 4;
  kakigori: number;
  lastAccrual: number;
  rolls: number;
  nextResetAt: number;
  nextClaimAt: number;
  power: number;
  keys: Record<string, KeyRecord>;
  owned: Record<string, OwnedRecord>;
  wishes: string[];
  starwish: string | null;
  soulmateId: string | null;
  current: CurrentRoll | null;
  crystal: Crystal | null;
  lastCrystalAt: number;
  /** Level-6 key payout: kakigori earned from rolling keyed cards, 3h window. */
  valuePayout: { amount: number; windowStart: number };
  upgrades: Upgrades;
  badges: Badges;
  tower: TowerState;
  lastDailyAt: number;
  /** 1-4: how often your own cards are held back. 4 = 4x rarer (Mudae parity). */
  novelty: number;
  /** Rolls per hour spent on wish spawn chance. */
  wishBoost: number;
  /** When the boost was last lowered (12h cooldown). */
  wishBoostAt: number;
  /** Pre-rolled kakigori for the current daily cycle. */
  dailyRoll: number;
  /** Saved wish lineups: two at most. */
  presets: WishPreset[];
  overrides: Record<string, Override>;
  stats: { rolls: number; claims: number; keys: number };
  log: LogLine[];
}

/** A kakigori crystal that spawns after a roll and can be collected for a few seconds. */
export interface Crystal {
  id: string;
  color: CrystalColor;
  value: number;
  at: number;
  x: number;
  y: number;
}

export type CrystalColor =
  | "purple"
  | "blue"
  | "teal"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "rainbow";

export class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameError";
  }
}

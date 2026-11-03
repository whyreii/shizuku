import { GameError } from "./types";
import type {
  BadgeKey,
  Badges,
  Crystal,
  CrystalColor,
  GameState,
  LogLine,
  Override,
  Tier,
  UpgradeKey,
  Upgrades,
  WishPreset,
} from "./types";
import { ROSTER, ROSTER_SIZE, characterById, rankValue } from "./roster";
import { clampShifts, tierForRank, weightForRank } from "./tiers";

/* ------------------------------------------------------------------ *
 * Economy constants (Mudae-sourced cadence)
 * ------------------------------------------------------------------ */

export const RESET_MS = 60 * 60 * 1000;
export const DAILY_MS = 20 * 60 * 60 * 1000;
export const CLAIM_WINDOW_MS = 30_000;
export const CLAIM_COOLDOWN_MS = 2 * 60 * 60 * 1000;
export const KEY_COOLDOWN_MS = 0; // Mudae: every owned roll adds a key
  export const MAX_KEY_LEVEL = 500;
export const BASE_KEYS = 10;
export const BASE_WISHES = 10;
export const ROLLS_PER_RESET = 10;

export const CRYSTAL_LIFE_MS = 6_000;
export const CRYSTAL_COOLDOWN_MS = 90_000;
export const CRYSTAL_SPAWN_CHANCE = 0.4;

/** Roll timer. Set false to test cards without the hourly economy. */
export const ROLL_TIMER_ENABLED = true;

export const TOWER_BASE_COST = 5000;
export const TOWER_FLOORS = 12;

/**
 * Roll pool: Mudae's limroul. The draw is uniform, so the pool size is the only
 * thing that moves the duplicate rate. It is fixed at the Mudae default of 7,000
 * because a smaller pool is strictly better: offered as a choice it is an upgrade,
 * not a trade. Composition (pin and disable) is the player's lever instead.
 */
export const POOL_SIZE = 7000;

/** Cards a roll can land on: the top 7,000 of the ranked roster. */
export function rollableCap(): number {
  return Math.min(POOL_SIZE, ROSTER_SIZE());
}

export interface PoolBypass {
  ids: Set<string>;
  wished: number;
  owned: number;
}

/**
 * Cards past the cap that still roll: wishes, the starwish, and everything you
 * already own. Mudae's antidisable adds a character back to the pool instead of
 * carving one out; your own collection is never stranded behind a smaller pool.
 */
export function poolBypass(state: GameState): PoolBypass {
  const cap = rollableCap();
  const ids = new Set<string>();
  let wished = 0;
  for (const id of state.wishes) {
    const char = characterById(id);
    if (char && char.rank > cap && !ids.has(id)) {
      ids.add(id);
      wished += 1;
    }
  }
  if (state.starwish) {
    const star = characterById(state.starwish);
    if (star && star.rank > cap && !ids.has(state.starwish)) {
      ids.add(state.starwish);
      wished += 1;
    }
  }
  let owned = 0;
  for (const id of Object.keys(state.owned)) {
    const char = characterById(id);
    if (char && char.rank > cap && !ids.has(id)) {
      ids.add(id);
      owned += 1;
    }
  }
  return { ids, wished, owned };
}

/** Cards a roll can land on: the pool plus anything past the cap above. */
export function rollableSize(state: GameState): number {
  return rollableCap() + poolBypass(state).ids.size;
}

export interface TowerPerk {
  id: number;
  label: string;
  blurb: string;
}

export const TOWER_PERKS: TowerPerk[] = [
  { id: 1, label: "+2 wishlist slots", blurb: "+2 wish slots" },
  { id: 2, label: "Starwish spawn +50%", blurb: "+50% starwish chance" },
  { id: 3, label: "Crystal spawn +10%", blurb: "+10% crystal spawn chance" },
  { id: 4, label: "Second shard chance", blurb: "+10% kakigori from shards" },
  { id: 5, label: "Richer crystals", blurb: "+5% crystal value" },
  { id: 6, label: "Claim bonus", blurb: "+50 kakigori per claim" },
  { id: 7, label: "Max power +110%", blurb: "+10% kakigori/hr" },
  { id: 8, label: "Cheaper claim", blurb: "-4% claim cooldown" },
  { id: 9, label: "Shard cap bonus", blurb: "+5% kakigori/hr" },
  { id: 10, label: "Light crystals", blurb: "+2% crystal spawn chance" },
  { id: 11, label: "+1 roll per hour", blurb: "+1 roll per hour" },
  { id: 12, label: "Colour unlocks", blurb: "+5 min off claim cooldown" },
  { id: 13, label: "Rarity lens", blurb: "+0.03pp S+ / +0.20pp S" },
];

export const WISH_BASE_MULTIPLIER = 1;
export const STARWISH_BASE_MULTIPLIER = 1;

/** Novelty 1-4: owned cards weigh base x factor. 4 = 4x rarer (Mudae persrare). */
export const NOVELTY_MIN = 1;
export const NOVELTY_MAX = 4;

export function noveltyFactor(state: GameState): number {
  const n = Math.max(NOVELTY_MIN, Math.min(NOVELTY_MAX, Math.round(state.novelty ?? NOVELTY_MAX)));
  return 1 - (n - 1) / NOVELTY_MAX;
}

/** Wish boost: rolls invested per hour -> bonus percent (Mudae curve). */
export function wishBoostPercent(rolls: number): number {
  const n = Math.max(0, Math.round(rolls));
  let pct = 0;
  pct += Math.min(n, 5) * 20;
  pct += Math.max(0, Math.min(n, 15) - 5) * 15;
  pct += Math.max(0, Math.min(n, 100) - 15) * 10;
  pct += Math.max(0, Math.min(n, 200) - 100) * 5;
  pct += Math.max(0, n - 200) * 1;
  return pct;
}

export function starwishBoostPercent(rolls: number): number {
  const n = Math.max(0, Math.round(rolls));
  let pct = 0;
  pct += Math.min(n, 100) * 10;
  pct += Math.max(0, Math.min(n, 200) - 100) * 5;
  pct += Math.max(0, n - 200) * 1;
  return pct;
}

/** Daily: RNG kakigori with a floor, plus a stack of rolls. */
export const DAILY_MIN = 100;
export const DAILY_MAX = 300;
export const DAILY_ROLLS = 10;

/* ------------------------------------------------------------------ *
 * Badges (7 tiers × 4 levels, cost = level × x, cumulative)
 * ------------------------------------------------------------------ */

export const BADGE_DEFS: Record<
  BadgeKey,
  { label: string; x: number; perks: [string, string, string, string] }
> = {
  bronze: {
    label: "Sleet",
    x: 1000,
    perks: [
      "+1 wish slot",
      "+1 wish slot",
      "+1 wish slot",
      "+1 wish slot · +500 kakigori on claiming a wished card",
    ],
  },
  silver: {
    label: "Hail",
    x: 2000,
    perks: [
      "+25% wish chance",
      "+25% wish chance",
      "+25% wish chance",
      "+25% wish chance · +5% extra",
    ],
  },
  gold: {
    label: "Glaze",
    x: 3000,
    perks: [
      "−10% power cost",
      "−10% power cost",
      "−10% power cost",
      "−10% power cost · daily restores power",
    ],
  },
  sapphire: {
    label: "Frost",
    x: 5000,
    perks: [
      "+1 permanent roll",
      "+1 permanent roll",
      "+1 permanent roll",
      "+1 permanent roll · +25% crystal value",
    ],
  },
  ruby: {
    label: "Blizzard",
    x: 7000,
    perks: [
      "+2 wish slots",
      "+50% wish chance",
      "−20% power cost",
      "+2 rolls · −25% badge prices",
    ],
  },
  emerald: {
    label: "Glacier",
    x: 9000,
    perks: [
      "claim timer reset every 50h",
      "−10h reset cooldown",
      "−10h reset cooldown",
      "−10h cooldown · +card value on claim",
    ],
  },
  diamond: {
    label: "Aurora",
    x: 12000,
    perks: [
      "+5% kakigori/hr",
      "+5% kakigori/hr",
      "+5% kakigori/hr",
      "+5% kakigori/hr · +10% more",
    ],
  },
};

const EMPTY_BADGES: Badges = {
  bronze: 0,
  silver: 0,
  gold: 0,
  sapphire: 0,
  ruby: 0,
  emerald: 0,
  diamond: 0,
};

export function badgePrice(state: GameState, key: BadgeKey): number {
  const def = BADGE_DEFS[key];
  const level = state.badges[key];
  const discount = state.badges.ruby >= 4 ? 0.75 : 1;
  return Math.round(def.x * (level + 1) * discount);
}

function twoBadgesAtIV(state: GameState, exclude: BadgeKey): boolean {
  return (Object.keys(state.badges) as BadgeKey[]).filter(
    (key) => key !== exclude && state.badges[key] >= 4,
  ).length >= 2;
}

/** Mudae prerequisites, with the "any two badges at IV" alternative. */
export function badgeLocked(state: GameState, key: BadgeKey): string | null {
  if (state.badges[key] >= 4) return "maxed";
  if (key === "sapphire") {
    const met =
      (state.badges.bronze >= 1 &&
        state.badges.silver >= 1 &&
        state.badges.gold >= 1) ||
      twoBadgesAtIV(state, key);
    return met ? null : "needs Sleet I + Hail I + Glaze I";
  }
  if (key === "ruby") {
    const met =
      (state.badges.bronze >= 2 &&
        state.badges.silver >= 2 &&
        state.badges.gold >= 2) ||
      twoBadgesAtIV(state, key);
    return met ? null : "needs Sleet II + Hail II + Glaze II";
  }
  if (key === "emerald") {
    const met =
      (state.badges.bronze >= 3 &&
        state.badges.silver >= 3 &&
        state.badges.gold >= 3) ||
      twoBadgesAtIV(state, key);
    return met ? null : "needs Sleet III + Hail III + Glaze III";
  }
  return null;
}

export function buyBadge(prev: GameState, key: BadgeKey): GameState {
  const lock = badgeLocked(prev, key);
  if (lock) throw new GameError(lock === "maxed" ? "Badge is maxed." : lock);
  const price = badgePrice(prev, key);
  if (prev.kakigori < price) {
    throw new GameError(`Need ${Math.ceil(price - prev.kakigori)} more kakigori.`);
  }
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori - price,
    badges: { ...prev.badges, [key]: prev.badges[key] + 1 },
    log: [...prev.log],
  };
  log(
    state,
    `${BADGE_DEFS[key].label} ${state.badges[key]} (${price} kakigori)`,
    "power",
  );
  return state;
}

/* ------------------------------------------------------------------ *
 * Key levels -> character value (Mudae reward table)
 * ------------------------------------------------------------------ */

/** +10% at levels 2/4/5/7/8/9, +5% per level from 11 up. */
export function keyValueMultiplier(level: number): number {
  let bonus = 0;
  for (const lvl of [2, 4, 5, 7, 8, 9]) {
    if (level >= lvl) bonus += 0.1;
  }
  if (level > 10) bonus += (level - 10) * 0.05;
  return 1 + bonus;
}

/** Crystal rules driven by a character's key level (Mudae reward table). */
export function crystalForCharacter(
  level: number,
  color: CrystalColor,
  baseValue: number,
): { color: CrystalColor; value: number; extra: boolean } {
  let nextColor = color;
  let value = baseValue;

  // L3: teal and green become orange.
  if (level >= 3 && (color === "teal" || color === "green")) {
    nextColor = "orange";
    value = Math.max(value, 750);
  }

  // L10: crystals on this character are worth more.
  if (level >= 10) value *= 1.5;

  // L50 / 200 / 400: purple, red and rainbow give more.
  if (nextColor === "purple" && level >= 50) value *= 1.75;
  if (nextColor === "red" && level >= 200) value *= 1.75;
  if (nextColor === "rainbow" && level >= 400) value *= 2;

  // L25 / 100 / 300 / 500: a second crystal can appear (represented as a double).
  const secondChance =
    level >= 500 ? 1 : level >= 300 ? 0.75 : level >= 100 ? 0.5 : level >= 25 ? 0.25 : 0;
  const extra = secondChance > 0 && Math.random() < secondChance;
  if (extra) value *= 2;

  return { color: nextColor, value: Math.round(value), extra };
}

/** L6: rolling a keyed character pays its value, capped per window. */
export const VALUE_PAYOUT_CAP = 4500;
export const VALUE_PAYOUT_WINDOW_MS = 3 * 60 * 60 * 1000;

/**
 * Mudae's flat base-value rungs. They land BEFORE any multiplier, which is what
 * lets a deep card earn real value: +15 at 10/15, +10 at 20/25/30, +5 at
 * 35-60, then +5 every 10 up to 300. Total +210 at L300+.
 */
export function baseValueBonus(level: number): number {
  let bonus = 0;
  if (level >= 10) bonus += 15;
  if (level >= 15) bonus += 15;
  if (level >= 20) bonus += 10;
  if (level >= 25) bonus += 10;
  if (level >= 30) bonus += 10;
  for (const lvl of [35, 40, 45, 50, 55, 60]) if (level >= lvl) bonus += 5;
  for (let lvl = 70; lvl <= 300; lvl += 10) if (level >= lvl) bonus += 5;
  return bonus;
}

/** Displayed value: base rungs first, then the shard multiplier. */
export function characterValueValue(rank: number, level: number): number {
  return Math.round((rankValue(rank) + baseValueBonus(level)) * keyValueMultiplier(level));
}

/* ------------------------------------------------------------------ *
 * Fountain
 * ------------------------------------------------------------------ */

export function towerPerkCount(state: GameState, perkId: number): number {
  return state.tower.perks.filter((id) => id === perkId).length;
}

export function towerCost(state: GameState): number {
  return TOWER_BASE_COST * (state.tower.floors + 1);
}

export function towerCanBuild(state: GameState, perkId: number): boolean {
  if (state.tower.floors % TOWER_FLOORS === 0 && state.tower.floors > 0) {
    return true; // new tower: perks reset, anything allowed
  }
  return !state.tower.perks.includes(perkId);
}

export function buildFloor(prev: GameState, perkId: number): GameState {
  const cost = towerCost(prev);
  if (prev.kakigori < cost) {
    throw new GameError(`Need ${Math.ceil(cost - prev.kakigori)} more kakigori.`);
  }
  if (!towerCanBuild(prev, perkId)) {
    throw new GameError("That perk is already built in this fountain.");
  }

  const freshTower = prev.tower.floors > 0 && prev.tower.floors % TOWER_FLOORS === 0;
  const perks = freshTower ? [perkId] : [...prev.tower.perks, perkId];

  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori - cost,
    tower: {
      floors: prev.tower.floors + 1,
      perks,
      spent: prev.tower.spent + cost,
    },
    log: [...prev.log],
  };
  log(state, `fountain basin ${state.tower.floors} built`, "power");
  return state;
}

export function destroyTower(prev: GameState): GameState {
  if (prev.tower.floors === 0) throw new GameError("No fountain to drain.");
  const refund = prev.tower.spent;
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + refund,
    tower: { ...EMPTY_TOWER, perks: [] },
    log: [...prev.log],
  };
  log(state, `fountain drained (+${Math.round(refund)} kakigori)`, "power");
  return state;
}

/* ------------------------------------------------------------------ *
 * Derived numbers
 * ------------------------------------------------------------------ */

export function powerCost(state: GameState, level: number): number {
  const discount = Math.min(
    0.6,
    state.badges.gold * 0.1 + (state.badges.ruby >= 3 ? 0.2 : 0),
  );
  return Math.round(150 * Math.pow(level + 1, 1.45) * (1 - discount));
}

export function rollsPerReset(state: GameState): number {
  const badgeRolls = state.badges.sapphire + (state.badges.ruby >= 4 ? 2 : 0);
  const boost = Math.max(0, Math.round(state.wishBoost ?? 0));
  return Math.max(1, ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls + towerPerkCount(state, 11) - boost);
}

export function claimCooldownMs(state: GameState): number {
  return Math.max(
    30 * 60 * 1000,
    CLAIM_COOLDOWN_MS - Math.max(0, state.badges.emerald - 1) * 10 * 60 * 1000,
  );
}

/**
 * Rarity shifts: the first level of the four lowest badges, plus up to two
 * Fountain lenses. Capped at MAX_SHIFTS inside clampShifts. Draining the
 * Fountain removes its lens, so the count is derived, never accumulated.
 */
export const BADGE_SHIFT_KEYS: BadgeKey[] = ["bronze", "silver", "gold", "sapphire"];
export const FOUNTAIN_LENS_ID = 13;
export const FOUNTAIN_SHIFT_CAP = 2;

export function rarityShifts(state: GameState): number {
  const fromBadges = BADGE_SHIFT_KEYS.filter((key) => state.badges[key] >= 1).length;
  const fromFountain = Math.min(
    FOUNTAIN_SHIFT_CAP,
    towerPerkCount(state, FOUNTAIN_LENS_ID),
  );
  return clampShifts(fromBadges + fromFountain);
}

/** Claiming pays shards by tier, so a card that never duplicates still climbs. */
export const CLAIM_SHARDS: Record<Tier, number> = {
  "S+": 10,
  S: 6,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

export function wishCap(state: GameState): number {
  const badgeWishes = state.badges.bronze + (state.badges.ruby >= 1 ? 2 : 0);
  return BASE_WISHES + badgeWishes + towerPerkCount(state, 1) * 2;
}

/* ------------------------------------------------------------------ *
 * Wish presets: named lineups, two at most
 * ------------------------------------------------------------------ */

export const MAX_PRESETS = 2;
const PRESET_NAME_MAX = 24;

/** Validates saved presets on load: unknown ids and junk entries are dropped. */
function readPresets(raw: unknown): WishPreset[] {
  if (!Array.isArray(raw)) return [];
  const out: WishPreset[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const p = entry as Partial<WishPreset>;
    if (typeof p.name !== "string" || !p.name.trim()) continue;
    out.push({
      id: typeof p.id === "string" && p.id ? p.id : `p${out.length + 1}`,
      name: p.name.trim().slice(0, PRESET_NAME_MAX),
      // ids are kept even when the roster cannot resolve them yet: a slow or
      // failed roster load must not empty a preset (same rule as owned cards)
      wishes: Array.isArray(p.wishes)
        ? p.wishes.filter((id): id is string => typeof id === "string").slice(0, 200)
        : [],
      starwish: typeof p.starwish === "string" ? p.starwish : null,
      savedAt: typeof p.savedAt === "number" ? p.savedAt : 0,
    });
    if (out.length >= MAX_PRESETS) break;
  }
  return out;
}

/** Snapshot the current lineup. The same name overwrites; a sixth name is refused. */
export function savePreset(prev: GameState, name: string): GameState {
  const label = name.trim().slice(0, PRESET_NAME_MAX);
  if (!label) throw new GameError("Give the preset a name.");
  const index = prev.presets.findIndex(
    (p) => p.name.toLowerCase() === label.toLowerCase(),
  );
  if (index < 0 && prev.presets.length >= MAX_PRESETS) {
    throw new GameError(`Two presets is the limit - delete one first.`);
  }
  const preset: WishPreset = {
    id:
      index >= 0
        ? prev.presets[index].id
        : `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: label,
    wishes: prev.wishes.slice(),
    starwish: prev.starwish,
    savedAt: Date.now(),
  };
  const presets =
    index >= 0
      ? prev.presets.map((p, i) => (i === index ? preset : p))
      : [...prev.presets, preset];
  return { ...prev, presets };
}

/** Replace the current lineup with a preset, clipped to the cap it must fit. */
export function applyPreset(prev: GameState, presetId: string): GameState {
  const preset = prev.presets.find((p) => p.id === presetId);
  if (!preset) return prev;
  const wishes = preset.wishes
    .filter((id) => characterById(id))
    .slice(0, wishCap(prev));
  const starwish =
    preset.starwish && characterById(preset.starwish) ? preset.starwish : null;
  return { ...prev, wishes, starwish };
}

export function deletePreset(prev: GameState, presetId: string): GameState {
  return { ...prev, presets: prev.presets.filter((p) => p.id !== presetId) };
}

/** Relative wish spawn multiplier from Silver and Ruby. */
/** Starwish makes that one card this many times more likely. */
/** Fountain perk 2 gives diminishing returns, like Mudae's tower. */
export function starwishTowerBonus(stacks: number): number {
  let bonus = 0;
  for (let n = 1; n <= stacks; n += 1) {
    bonus += n <= 5 ? [0, 0.5, 0.25, 0.2, 0.16, 0.13][n] : 0.5 / Math.pow(n, 0.9);
  }
  return bonus;
}

export function starwishMultiplier(state: GameState): number {
  return (
    STARWISH_BASE_MULTIPLIER +
    starwishTowerBonus(towerPerkCount(state, 2)) +
    starwishBoostPercent(state.wishBoost ?? 0) / 100
  );
}

/** Wished cards carry this much extra weight. */
/** Mudae: Silver I-IV +25% each, Ruby II +50%, plus the wish boost investment. */
export function wishMultiplier(state: GameState): number {
  const badge = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_BASE_MULTIPLIER + badge + wishBoostPercent(state.wishBoost ?? 0) / 100;
}

export function keyCap(_state: GameState): number {
  return MAX_KEY_LEVEL;
}

export function totalKeys(state: GameState): number {
  return Object.values(state.keys).reduce((sum, k) => sum + k.keys, 0);
}

/** Passive income. This number is the progression metric. */
export function kakigoriPerHour(state: GameState): number {
  const soul = state.soulmateId ? 25 : 0;
  // No free income: every kakigori comes from shards, power or a soulmate.
  const base = totalKeys(state) * 12 + state.power * 3 + soul;
  const diamond =
    1 + state.badges.diamond * 0.05 + (state.badges.diamond >= 4 ? 0.1 : 0);
  const tower =
    1 +
    towerPerkCount(state, 7) * 0.1 +
    towerPerkCount(state, 9) * 0.05 +
    towerPerkCount(state, 4) * 0.1;
  return base * diamond * tower;
}

export function collectionValue(state: GameState): number {
  let value = 0;
  for (const id of Object.keys(state.owned)) {
    const char = characterById(id);
    if (char) value += characterValueValue(char.rank, keysFor(state, char.id));
  }
  return value;
}

/* ------------------------------------------------------------------ *
 * Upgrades
 * ------------------------------------------------------------------ */

export const UPGRADE_DEFS: Record<
  UpgradeKey,
  { label: string; blurb: string; base: number; growth: number; max: number }
> = {
  rolls: {
    label: "Roll output",
    blurb: "+2 rolls every hour",
    base: 900,
    growth: 1.5,
    max: 15,
  },
  claims: {
    label: "Claim speed",
    blurb: "−10 min claim cooldown",
    base: 2400,
    growth: 1.6,
    max: 9,
  },
  wishes: {
    label: "Wish slots",
    blurb: "+2 wishlist slots",
    base: 1200,
    growth: 1.4,
    max: 10,
  },
  keys: {
    label: "Shard capacity",
    blurb: "+1 shard per character",
    base: 1600,
    growth: 1.5,
    max: 10,
  },
};

export function upgradeCost(state: GameState, key: UpgradeKey): number {
  const def = UPGRADE_DEFS[key];
  return Math.round(def.base * Math.pow(state.upgrades[key] + 1, def.growth));
}

export function buyUpgrade(prev: GameState, key: UpgradeKey): GameState {
  const def = UPGRADE_DEFS[key];
  if (prev.upgrades[key] >= def.max) throw new GameError(`${def.label} is maxed.`);
  const cost = upgradeCost(prev, key);
  if (prev.kakigori < cost) {
    throw new GameError(`Need ${Math.ceil(cost - prev.kakigori)} more kakigori.`);
  }
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori - cost,
    upgrades: { ...prev.upgrades, [key]: prev.upgrades[key] + 1 },
    log: [...prev.log],
  };
  log(state, `${def.label} → lv ${state.upgrades[key]}`, "power");
  return state;
}

/* ------------------------------------------------------------------ *
 * State creation / migration
 * ------------------------------------------------------------------ */

const EMPTY_UPGRADES: Upgrades = { rolls: 0, claims: 0, wishes: 0, keys: 0 };
const EMPTY_TOWER = { floors: 0, perks: [] as number[], spent: 0 };

export function createInitialState(now: number): GameState {
  return {
    version: 4,
    kakigori: 0,
    dailyRoll: 0,
  presets: [],
    lastAccrual: now,
    rolls: ROLLS_PER_RESET,
    nextResetAt: now + RESET_MS,
    nextClaimAt: 0,
    power: 0,
    keys: {},
    owned: {},
    wishes: [],
    starwish: null,
    soulmateId: null,
    current: null,
    crystal: null,
    lastCrystalAt: 0,
    valuePayout: { amount: 0, windowStart: 0 },
    upgrades: { ...EMPTY_UPGRADES },
    badges: { ...EMPTY_BADGES },
    tower: { ...EMPTY_TOWER, perks: [] },
    lastDailyAt: 0,
    novelty: NOVELTY_MAX,
    wishBoost: 0,
    wishBoostAt: 0,
    overrides: {},
    stats: { rolls: 0, claims: 0, keys: 0 },
    log: [],
  };
}

/** Lifts v1 (category roster) and v2 (kakera field) saves to v3. */
export function hydrate(raw: Partial<GameState> & Record<string, unknown>): GameState {
  const base = createInitialState(Date.now());
  const known = new Set(ROSTER.map((c) => c.id));

  // Cards are never deleted for being unknown to the roster. A slow or failed
  // roster load used to prune every extra-pool claim from the save; unknown ids
  // are now kept and simply not rendered until the roster catches up.
  const owned: GameState["owned"] = {
    ...((raw.owned as GameState["owned"]) ?? {}),
  };

  const keys: GameState["keys"] = {
    ...((raw.keys as GameState["keys"]) ?? {}),
  };

  const legacyCurrency =
    typeof raw.kakigori === "number"
      ? raw.kakigori
      : typeof raw.kakera === "number"
        ? (raw.kakera as number)
        : base.kakigori;

  const upgraded: Upgrades = { ...EMPTY_UPGRADES, ...((raw.upgrades as Upgrades) ?? {}) };
  const badges: Badges = { ...EMPTY_BADGES, ...((raw.badges as Badges) ?? {}) };
  const cap = BASE_WISHES + badges.bronze + (badges.ruby >= 1 ? 2 : 0);

  return {
    ...base,
    kakigori: legacyCurrency,
    lastAccrual: typeof raw.lastAccrual === "number" ? raw.lastAccrual : base.lastAccrual,
    rolls: typeof raw.rolls === "number" ? raw.rolls : base.rolls,
    nextResetAt: typeof raw.nextResetAt === "number" ? raw.nextResetAt : base.nextResetAt,
    nextClaimAt: typeof raw.nextClaimAt === "number" ? raw.nextClaimAt : 0,
    power: typeof raw.power === "number" ? raw.power : 0,
    keys,
    owned,
    wishes: ((raw.wishes as string[]) ?? []).filter((id) => known.has(id)).slice(0, cap),
    starwish: known.has(raw.starwish as string) ? (raw.starwish as string) : null,
    soulmateId: known.has(raw.soulmateId as string) ? (raw.soulmateId as string) : null,
    upgrades: upgraded,
    badges,
    tower: { ...EMPTY_TOWER, ...((raw.tower as GameState["tower"]) ?? {}), perks: ((raw.tower as GameState["tower"])?.perks ?? []).slice() },
    lastDailyAt: typeof raw.lastDailyAt === "number" ? raw.lastDailyAt : 0,
    presets: readPresets(raw.presets),
  overrides: (raw.overrides as Record<string, Override>) ?? {},
    stats: (raw.stats as GameState["stats"]) ?? { rolls: 0, claims: 0, keys: 0 },
    log: (raw.log as LogLine[]) ?? [],
    current: null,
    crystal: null,
    lastCrystalAt: typeof raw.lastCrystalAt === "number" ? raw.lastCrystalAt : 0,
    valuePayout:
      (raw.valuePayout as GameState["valuePayout"]) ?? { amount: 0, windowStart: 0 },
  };
}

function log(state: GameState, text: string, tone: LogLine["tone"]): void {
  state.log = [
    { id: Math.random().toString(36).slice(2), at: Date.now(), text, tone },
    ...state.log,
  ].slice(0, 40);
}

/* ------------------------------------------------------------------ *
 * Time
 * ------------------------------------------------------------------ */

export function tick(prev: GameState, now: number): GameState {
  let changed = false;
  const state: GameState = { ...prev };

  const hours = (now - prev.lastAccrual) / 3_600_000;
  if (hours > 0) {
    state.kakigori = prev.kakigori + kakigoriPerHour(prev) * hours;
    state.lastAccrual = now;
    changed = true;
  }

  const derivedPower = Math.floor(totalKeys(prev) / 10);
  if (derivedPower !== prev.power) {
    state.power = derivedPower;
    changed = true;
  }

  if (now >= prev.nextResetAt) {
    if (ROLL_TIMER_ENABLED) {
      const missed = 1 + Math.floor((now - prev.nextResetAt) / RESET_MS);
      state.rolls = Math.max(prev.rolls, rollsPerReset(prev));
      state.nextResetAt = prev.nextResetAt + missed * RESET_MS;
      changed = true;
    } else {
      state.rolls = rollCap(prev);
      state.nextResetAt = now + RESET_MS;
      changed = true;
    }
  }

  if (prev.crystal && now - prev.crystal.at > CRYSTAL_LIFE_MS) {
    state.crystal = null;
    changed = true;
  }

  return changed ? state : prev;
}

export function rollCap(state: GameState): number {
  return rollsPerReset(state);
}

/** Test helper: drop extra rolls into the current save. */
export function grantRolls(prev: GameState, amount: number): GameState {
  const state: GameState = {
    ...prev,
    rolls: Math.min(9999, prev.rolls + amount),
    log: [...prev.log],
  };
  log(state, `test grant +${amount} rolls`, "info");
  return state;
}

/* ------------------------------------------------------------------ *
 * Daily
 * ------------------------------------------------------------------ */

export function dailyAvailable(state: GameState, now: number): number {
  return Math.max(0, state.lastDailyAt + DAILY_MS - now);
}

function rollDaily(): number {
  return DAILY_MIN + Math.floor(Math.random() * (DAILY_MAX - DAILY_MIN + 1));
}

/** The stored roll for this cycle - rolled once when the timer expires. */
/** Nothing is revealed until the player claims - the roll happens on click. */
export function dailyAmount(state: GameState): number {
  return state.dailyRoll > 0 ? state.dailyRoll : rollDaily();
}

export function claimDaily(prev: GameState, now: number): GameState {
  const wait = dailyAvailable(prev, now);
  if (wait > 0) {
    const h = Math.floor(wait / 3_600_000);
    const m = Math.ceil((wait % 3_600_000) / 60_000);
    throw new GameError(`Daily ready in ${h}h ${m}m.`);
  }
  const amount = rollDaily();
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + amount,
    // bonus rolls stack on top of the cap rather than being wasted
    rolls: prev.rolls + DAILY_ROLLS,
    dailyRoll: amount,
    lastDailyAt: now,
    log: [...prev.log],
  };
  log(state, `daily +${Math.round(amount)} kakigori, +${DAILY_ROLLS} rolls`, "info");
  return state;
}

/* ------------------------------------------------------------------ *
 * Crystals
 * ------------------------------------------------------------------ */

const CRYSTAL_TABLE: { color: CrystalColor; value: number; chance: number }[] = [
  { color: "purple", value: 100, chance: 0.6 },
  { color: "blue", value: 125, chance: 0.25 },
  { color: "teal", value: 200, chance: 0.08 },
  { color: "green", value: 280, chance: 0.04 },
  { color: "yellow", value: 450, chance: 0.02 },
  { color: "orange", value: 750, chance: 0.007 },
  { color: "red", value: 1500, chance: 0.0025 },
  { color: "rainbow", value: 3000, chance: 0.0005 },
];

function rollCrystal(multiplier: number): Crystal {
  const r = Math.random();
  let acc = 0;
  let picked = CRYSTAL_TABLE[0];
  for (const entry of CRYSTAL_TABLE) {
    acc += entry.chance;
    if (r <= acc) {
      picked = entry;
      break;
    }
  }
  return {
    id: Math.random().toString(36).slice(2),
    color: picked.color,
    value: Math.round(picked.value * multiplier),
    at: Date.now(),
    x: 22 + Math.random() * 56,
    y: 30 + Math.random() * 40,
  };
}

export function crystalReady(state: GameState, now: number): boolean {
  return now - state.lastCrystalAt >= CRYSTAL_COOLDOWN_MS;
}

export function collectCrystal(prev: GameState, now: number): GameState {
  const crystal = prev.crystal;
  if (!crystal) throw new GameError("No crystal to collect.");
  if (now - crystal.at > CRYSTAL_LIFE_MS) throw new GameError("It melted.");
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + crystal.value,
    crystal: null,
    log: [...prev.log],
  };
  log(state, `+${crystal.value} kakigori (${crystal.color})`, "info");
  return state;
}

/* ------------------------------------------------------------------ *
 * Rolling
 * ------------------------------------------------------------------ */


export interface RollResult {
  state: GameState;
  charId: string;
  special: "starwish" | "wish" | null;
}

export function roll(prev: GameState, now: number): RollResult {
  if (prev.rolls < 1) throw new GameError("No rolls left — they refill every hour.");

  const members = ROSTER;
  if (members.length === 0) throw new GameError("Roster is empty.");
  const cap = rollableCap();
  const bypass = poolBypass(prev).ids;

  const shifts = rarityShifts(prev);
  let targetId: string | null = null;
  let special: RollResult["special"] = null;

  // One weighted draw. Wishes and the starwish carry extra weight instead of
  // overriding the pool, so the ladder still decides what is rare.
  const wishSet = new Set(prev.wishes);
  const starId = prev.starwish;
  const novelty = noveltyFactor(prev);
  const wishBoostFactor = wishMultiplier(prev);
  const starBoost = starwishMultiplier(prev);

  let total = 0;
  let lastInPool = members[0];
  for (const c of members) {
    if (c.rank > cap && !bypass.has(c.id)) continue;
    lastInPool = c;
    let weight = weightForRank(c.rank, shifts);
    if (prev.owned[c.id]) weight *= novelty;
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoostFactor;
    total += weight;
  }
  let draw = Math.random() * total;
  targetId = lastInPool.id;
  for (const c of members) {
    if (c.rank > cap && !bypass.has(c.id)) continue;
    let weight = weightForRank(c.rank, shifts);
    if (prev.owned[c.id]) weight *= novelty;
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoostFactor;
    draw -= weight;
    if (draw <= 0) {
      targetId = c.id;
      break;
    }
  }
  if (starId && targetId === starId) special = "starwish";
  else if (wishSet.has(targetId)) special = "wish";

  const char = characterById(targetId)!;
  const nextRolls = ROLL_TIMER_ENABLED ? prev.rolls - 1 : prev.rolls;

  const state: GameState = {
    ...prev,
    rolls: nextRolls,
    stats: { ...prev.stats, rolls: prev.stats.rolls + 1 },
    current: { charId: targetId, rolledAt: now, claimed: false, keyed: false },
    log: [...prev.log],
  };

  // Mudae: keys come from rolling a character you already own.
  let keyed = false;
  if (prev.owned[targetId]) {
    const record = prev.keys[targetId];
    const held = record?.keys ?? 0;
    if (held < keyCap(prev)) {
      state.keys = {
        ...prev.keys,
        [targetId]: { keys: held + 1, lastKeyAt: now },
      };
      keyed = true;
    }
  }
  if (keyed) {
    state.current = { ...state.current!, keyed: true };
    state.stats = { ...state.stats, keys: state.stats.keys + 1 };
  }

  // L6: rolling a keyed character pays its value (capped, 3h window).
  if (prev.owned[targetId] && (prev.keys[targetId]?.keys ?? 0) >= 6) {
    const nowWindow = prev.valuePayout.windowStart + VALUE_PAYOUT_WINDOW_MS;
    const fresh = now >= nowWindow;
    const earnedSoFar = fresh ? 0 : prev.valuePayout.amount;
    const room = Math.max(0, VALUE_PAYOUT_CAP - earnedSoFar);
    if (room > 0) {
      const payout = Math.min(
        room,
        characterValueValue(char.rank, prev.keys[targetId]?.keys ?? 0),
      );
      if (payout > 0) {
        state.kakigori = prev.kakigori + payout;
        state.valuePayout = {
          amount: earnedSoFar + payout,
          windowStart: fresh ? now : prev.valuePayout.windowStart,
        };
      }
    }
  }

  const spawnChance =
    CRYSTAL_SPAWN_CHANCE +
    towerPerkCount(prev, 3) * 0.1 +
    towerPerkCount(prev, 10) * 0.02;
  if (prev.owned[targetId] && crystalReady(prev, now) && Math.random() < spawnChance) {
    const valueMult =
      (prev.badges.sapphire >= 4 ? 1.25 : 1) * (1 + towerPerkCount(prev, 5) * 0.05);
    const base = rollCrystal(valueMult);
    const level = prev.keys[targetId]?.keys ?? 0;
    const tuned = crystalForCharacter(level, base.color, base.value);
    state.crystal = { ...base, color: tuned.color, value: tuned.value };
    state.lastCrystalAt = now;
  }

  log(
    state,
    `#${char.rank} ${char.name}${special === "starwish" ? " ★ STARWISH" : special === "wish" ? " ✦ wish" : ""}${keyed ? " · +1 shard" : ""}`,
    "roll",
  );
  state.log[0] = { ...state.log[0], charId: targetId, special };

  return { state, charId: targetId, special };
}

/* ------------------------------------------------------------------ *
 * Claiming
 * ------------------------------------------------------------------ */

export function claimWindowOpen(state: GameState, now: number): boolean {
  if (!state.current) return false;
  return now - state.current.rolledAt < CLAIM_WINDOW_MS;
}

export function claimReadyIn(state: GameState, now: number): number {
  return Math.max(0, state.nextClaimAt - now);
}

export function claim(prev: GameState, now: number): GameState {
  const cur = prev.current;
  if (!cur) throw new GameError("Roll something first.");
  if (!claimWindowOpen(prev, now)) throw new GameError("Claim window closed.");
  if (cur.claimed) throw new GameError("Already claimed this one.");
  if (prev.owned[cur.charId]) throw new GameError("Already in your collection.");

  const wait = claimReadyIn(prev, now);
  if (wait > 0) {
    const m = Math.ceil(wait / 60_000);
    throw new GameError(`Claim ready in ${m}m.`);
  }

  const char = characterById(cur.charId);
  if (!char) throw new GameError("Character missing from roster.");

  let bonus = towerPerkCount(prev, 6) * 50;
  if (prev.badges.bronze >= 4 && prev.wishes.includes(char.id)) bonus += 500;
  if (prev.badges.emerald >= 4) bonus += rankValue(char.rank);

  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + bonus,
    nextClaimAt: now + claimCooldownMs(prev),
    owned: {
      ...prev.owned,
      [cur.charId]: { charId: cur.charId, claimedAt: now, soulmate: false },
    },
    current: { ...cur, claimed: true },
    stats: { ...prev.stats, claims: prev.stats.claims + 1 },
    log: [...prev.log],
  };
  // Claiming pays shards by tier, so a card that never duplicates still climbs.
  const shardGrant = CLAIM_SHARDS[tierForRank(char.rank)];
  if (shardGrant > 0) {
    const held = prev.keys[cur.charId]?.keys ?? 0;
    const next = Math.min(keyCap(prev), held + shardGrant);
    if (next > held) {
      state.keys = {
        ...prev.keys,
        [cur.charId]: { keys: next, lastKeyAt: now },
      };
      state.stats = { ...state.stats, keys: state.stats.keys + (next - held) };
    }
  }

  log(
    state,
    `claimed ${char.name}${bonus > 0 ? ` (+${Math.round(bonus)} kakigori)` : ""}`,
    "claim",
  );
  return state;
}

/* ------------------------------------------------------------------ *
 * Lootboxes (badge-gated, like Mudae's $kl)
 * ------------------------------------------------------------------ */

export const LOOT_COST = 1000;

export function lootGate(state: GameState): string | null {
  if (
    state.badges.sapphire >= 1 &&
    state.badges.ruby >= 1 &&
    state.badges.emerald >= 1
  ) {
    return null;
  }
  return "needs Frost Lv 1 + Blizzard Lv 1 + Glacier Lv 1";
}

export interface LootReward {
  label: string;
  kind: "kakigori" | "rolls" | "claim";
}

const LOOT_TABLE: { weight: number; reward: () => LootReward; apply: (s: GameState) => void }[] = [
  {
    weight: 45,
    reward: () => {
      const value = 100 + Math.floor(Math.random() * 121);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 100 + Math.floor(Math.random() * 121);
    },
  },
  {
    weight: 25,
    reward: () => {
      const value = 600 + Math.floor(Math.random() * 450);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 600 + Math.floor(Math.random() * 450);
    },
  },
  {
    weight: 8,
    reward: () => {
      const value = 2500 + Math.floor(Math.random() * 501);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 2500 + Math.floor(Math.random() * 501);
    },
  },
  {
    weight: 1,
    reward: () => ({ label: "+42,069 kakigori", kind: "kakigori" }),
    apply: (s) => {
      s.kakigori += 42069;
    },
  },
  {
    weight: 12,
    reward: () => ({ label: "+1 roll", kind: "rolls" }),
    apply: (s) => {
      s.rolls += 1;
    },
  },
  {
    weight: 6,
    reward: () => ({ label: "claim timer reset", kind: "claim" }),
    apply: (s) => {
      s.nextClaimAt = 0;
    },
  },
  {
    weight: 3,
    reward: () => ({ label: "+2 rolls", kind: "rolls" }),
    apply: (s) => {
      s.rolls += 2;
    },
  },
];

const LOOT_WEIGHT_TOTAL = LOOT_TABLE.reduce((sum, entry) => sum + entry.weight, 0);

/** Reward categories a loot can pay out, for the sealed preview. */
export const LOOT_KINDS: string[] = [
  ...new Set(LOOT_TABLE.map((entry) => entry.reward().kind)),
];

export function openLoot(prev: GameState, count = 1): { state: GameState; rewards: LootReward[] } {
  const gate = lootGate(prev);
  if (gate) throw new GameError(gate);
  const boxes = Math.max(1, Math.min(10, count));
  const cost = LOOT_COST * boxes;
  if (prev.kakigori < cost) {
    throw new GameError(`Need ${Math.ceil(cost - prev.kakigori)} more kakigori.`);
  }

  const state: GameState = { ...prev, kakigori: prev.kakigori - cost, log: [...prev.log] };
  const rewards: LootReward[] = [];

  for (let i = 0; i < boxes; i += 1) {
    let r = Math.random() * LOOT_WEIGHT_TOTAL;
    for (const entry of LOOT_TABLE) {
      r -= entry.weight;
      if (r <= 0) {
        rewards.push(entry.reward());
        entry.apply(state);
        break;
      }
    }
  }

  log(
    state,
    boxes === 1
      ? `loot · ${rewards[0]?.label ?? "nothing"}`
      : `loot ×${boxes} · ${cost} kakigori`,
    "info",
  );
  return { state, rewards };
}

/* ------------------------------------------------------------------ *
 * Keys
 * ------------------------------------------------------------------ */

export function keyStatus(prev: GameState, now: number) {
  const cur = prev.current;
  if (!cur) return { allowed: false, reason: "Nothing rolled." };
  if (!prev.owned[cur.charId]) {
    return { allowed: false, reason: "Shards only come from rolling a card you own." };
  }
  if (cur.keyed) return { allowed: false, reason: "Already keyed this roll." };
  const record = prev.keys[cur.charId];
  if (record && record.keys >= keyCap(prev)) {
    return { allowed: false, reason: `Max ${keyCap(prev)} shards.` };
  }
  if (record && now - record.lastKeyAt < KEY_COOLDOWN_MS) {
    const mins = Math.ceil((KEY_COOLDOWN_MS - (now - record.lastKeyAt)) / 60000);
    return { allowed: false, reason: `Shard cooldown: ${mins}m.` };
  }
  return { allowed: true, reason: "" };
}

export function addKey(prev: GameState, now: number): GameState {
  const status = keyStatus(prev, now);
  if (!status.allowed) throw new GameError(status.reason);
  const cur = prev.current!;
  const existing = prev.keys[cur.charId] ?? { keys: 0, lastKeyAt: 0 };
  const state: GameState = {
    ...prev,
    keys: {
      ...prev.keys,
      [cur.charId]: { keys: existing.keys + 1, lastKeyAt: now },
    },
    current: { ...cur, keyed: true },
    stats: { ...prev.stats, keys: prev.stats.keys + 1 },
    log: [...prev.log],
  };
  const name = characterById(cur.charId)?.name ?? "character";
  log(state, `shard → ${name} (${existing.keys + 1}/${keyCap(prev)})`, "key");
  return state;
}

export function keysFor(state: GameState, charId: string): number {
  return state.keys[charId]?.keys ?? 0;
}

/* ------------------------------------------------------------------ *
 * Divorce (returns the card's kakigori value, like $divorce)
 * ------------------------------------------------------------------ */

/** Releasing a card refunds exactly what it is worth right now. */
export function divorceValue(charId: string, level = 0): number {
  const char = characterById(charId);
  return char ? characterValueValue(char.rank, level) : 0;
}

export function divorce(prev: GameState, charId: string): GameState {
  if (!prev.owned[charId]) throw new GameError("You don't own that character.");
  const char = characterById(charId);
  if (!char) throw new GameError("Character missing from roster.");

  const keysHeld = keysFor(prev, charId);
  const payout = divorceValue(charId, keysHeld);
  const keysOwned = keysHeld;

  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + payout,
    owned: { ...prev.owned },
    keys: { ...prev.keys },
    soulmateId: prev.soulmateId === charId ? null : prev.soulmateId,
    log: [...prev.log],
  };
  delete state.owned[charId];

  // Mudae: divorcing a 21+ key character loses 5% of its keys.
  if (keysOwned > 0) {
    const kept = keysOwned >= 21 ? Math.ceil(keysOwned * 0.95) : keysOwned;
    const record = state.keys[charId];
    if (record) state.keys[charId] = { ...record, keys: kept };
  }

  log(state, `divorced ${char.name} (+${Math.round(payout)} kakigori)`, "claim");
  return state;
}

/* ------------------------------------------------------------------ *
 * Power
 * ------------------------------------------------------------------ */

export function levelUp(prev: GameState): GameState {
  const cost = powerCost(prev, prev.power);
  if (prev.kakigori < cost) {
    throw new GameError(`Need ${Math.ceil(cost - prev.kakigori)} more kakigori.`);
  }
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori - cost,
    power: prev.power + 1,
    log: [...prev.log],
  };
  log(state, `power ${state.power}`, "power");
  return state;
}

/* ------------------------------------------------------------------ *
 * Wishes
 * ------------------------------------------------------------------ */

export function toggleWish(prev: GameState, charId: string): GameState {
  const state: GameState = { ...prev };
  if (prev.wishes.includes(charId)) {
    state.wishes = prev.wishes.filter((id) => id !== charId);
    if (prev.starwish === charId) state.starwish = null;
  } else {
    if (prev.wishes.length >= wishCap(prev)) {
      throw new GameError(`Wishlist is full (${wishCap(prev)}).`);
    }
    state.wishes = [...prev.wishes, charId];
  }
  return state;
}

export function toggleStarwish(prev: GameState, charId: string): GameState {
  const state: GameState = { ...prev };
  if (prev.starwish === charId) {
    state.starwish = null;
  } else {
    if (!prev.wishes.includes(charId) && prev.wishes.length >= wishCap(prev)) {
      throw new GameError(`Wishlist is full (${wishCap(prev)}).`);
    }
    state.starwish = charId;
    if (!prev.wishes.includes(charId)) state.wishes = [...prev.wishes, charId];
  }
  return state;
}

/* ------------------------------------------------------------------ *
 * Soulmate
 * ------------------------------------------------------------------ */

export function toggleSoulmate(prev: GameState, charId: string): GameState {
  if (!prev.owned[charId]) throw new GameError("You must claim it first.");
  if (keysFor(prev, charId) < 10) {
    throw new GameError("Soulmate needs 10 shards on that character.");
  }
  const binding = prev.soulmateId !== charId;
  const state: GameState = { ...prev };
  state.soulmateId = binding ? charId : null;
  state.owned = {
    ...prev.owned,
    [charId]: { ...prev.owned[charId], soulmate: binding },
  };
  state.log = [...prev.log];
  log(state, binding ? "soulmate bound" : "soulmate released", "info");
  return state;
}

/* ------------------------------------------------------------------ *
 * Personalisation
 * ------------------------------------------------------------------ */

export function setOverride(
  prev: GameState,
  charId: string,
  patch: Partial<Override>,
): GameState {
  const existing = prev.overrides[charId] ?? {};
  return { ...prev, overrides: { ...prev.overrides, [charId]: { ...existing, ...patch } } };
}

export function displayName(state: GameState, charId: string): string {
  const override = state.overrides[charId];
  if (override?.alias) return override.alias;
  return characterById(charId)?.name ?? "Unknown";
}

/* ------------------------------------------------------------------ *
 * Presentation helpers
 * ------------------------------------------------------------------ */

export function formatKakera(value: number): string {
  return Math.floor(value).toLocaleString("en-US");
}

/** Compact form for headers: 1.2k, 12.4k, 1.2M. */
export function formatCompact(value: number): string {
  const n = Math.floor(value);
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

/** Explicit date, no locale guessing: 2 Nov 2026. */
export function formatDate(value: number | string | Date): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

/** Minutes only — stops the header ticking every second. */
export function formatMinutes(ms: number): string {
  if (ms <= 0) return "READY";
  const minutes = Math.ceil(ms / 60_000);
  if (minutes < 60) return `${minutes}M`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}H` : `${h}H ${m}M`;
}

const ROMAN = ["I", "II", "III", "IV"];

/** Cheapest unlocked badge still missing a level, for the "next goal" line. */
export function nextGoal(state: GameState): { label: string; cost: number } | null {
  const options = (Object.keys(BADGE_DEFS) as BadgeKey[])
    .filter((key) => state.badges[key] < 4 && !badgeLocked(state, key))
    .map((key) => ({
      label: `${BADGE_DEFS[key].label} ${ROMAN[state.badges[key]]}`,
      cost: badgePrice(state, key),
    }));
  if (options.length === 0) return null;
  options.sort((a, b) => a.cost - b.cost);
  return options[0];
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "ready";
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

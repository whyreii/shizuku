import io

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

# --- constants -------------------------------------------------------------
s = s.replace(
    "export const WISH_CHANCE = 0.1;",
    """export const TOWER_BASE_COST = 5000;
export const TOWER_FLOORS = 12;

export interface TowerPerk {
  id: number;
  label: string;
  blurb: string;
}

export const TOWER_PERKS: TowerPerk[] = [
  { id: 1, label: "+2 wishlist slots", blurb: "+2 wish slots" },
  { id: 2, label: "Starwish spawn +50%", blurb: "+50% starwish chance" },
  { id: 3, label: "Crystal spawn +10%", blurb: "+10% crystal spawn chance" },
  { id: 4, label: "Second key chance", blurb: "+10% kakigori from keys" },
  { id: 5, label: "Richer crystals", blurb: "+5% crystal value" },
  { id: 6, label: "Claim bonus", blurb: "+50 kakigori per claim" },
  { id: 7, label: "Max power +110%", blurb: "+10% kakigori/hr" },
  { id: 8, label: "Cheaper claim", blurb: "-4% claim cooldown" },
  { id: 9, label: "Key cap bonus", blurb: "+5% kakigori/hr" },
  { id: 10, label: "Light crystals", blurb: "+2% crystal spawn chance" },
  { id: 11, label: "+1 roll per hour", blurb: "+1 roll per hour" },
  { id: 12, label: "Colour unlocks", blurb: "+5 min off claim cooldown" },
];

export const WISH_CHANCE = 0.1;""",
)

# --- state creation --------------------------------------------------------
s = s.replace(
    "const EMPTY_UPGRADES: Upgrades = { rolls: 0, claims: 0, wishes: 0, keys: 0 };",
    """const EMPTY_UPGRADES: Upgrades = { rolls: 0, claims: 0, wishes: 0, keys: 0 };
const EMPTY_TOWER = { floors: 0, perks: [] as number[], spent: 0 };""",
)

s = s.replace(
    "    upgrades: { ...EMPTY_UPGRADES },\n    badges: { ...EMPTY_BADGES },",
    "    upgrades: { ...EMPTY_UPGRADES },\n    badges: { ...EMPTY_BADGES },\n    tower: { ...EMPTY_TOWER, perks: [] },",
)

s = s.replace(
    "    upgrades: upgraded,\n    badges,",
    "    upgrades: upgraded,\n    badges,\n    tower: { ...EMPTY_TOWER, ...((raw.tower as GameState[\"tower\"]) ?? {}), perks: ((raw.tower as GameState[\"tower\"])?.perks ?? []).slice() },",
)

# --- tower helpers ---------------------------------------------------------
s = s.replace(
    "/* ------------------------------------------------------------------ *\n * Derived numbers",
    """/* ------------------------------------------------------------------ *
 * Kakera Tower
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
    throw new GameError("That perk is already built in this tower.");
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
  log(state, `tower floor ${state.tower.floors} built`, "power");
  return state;
}

export function destroyTower(prev: GameState): GameState {
  if (prev.tower.floors === 0) throw new GameError("No tower to destroy.");
  const refund = prev.tower.spent;
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + refund,
    tower: { ...EMPTY_TOWER, perks: [] },
    log: [...prev.log],
  };
  log(state, `tower destroyed (+${Math.round(refund)} kakigori)`, "power");
  return state;
}

/* ------------------------------------------------------------------ *
 * Derived numbers""",
)

# --- effects ---------------------------------------------------------------
s = s.replace(
    "  return ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls;",
    "  return ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls + towerPerkCount(state, 11);",
)

s = s.replace(
    "  const badgeWishes = state.badges.bronze + (state.badges.ruby >= 1 ? 2 : 0);\n  return BASE_WISHES + badgeWishes;",
    "  const badgeWishes = state.badges.bronze + (state.badges.ruby >= 1 ? 2 : 0);\n  return BASE_WISHES + badgeWishes + towerPerkCount(state, 1) * 2;",
)

s = s.replace(
    """  const diamond =
    1 + state.badges.diamond * 0.05 + (state.badges.diamond >= 4 ? 0.1 : 0);
  return base * diamond;""",
    """  const diamond =
    1 + state.badges.diamond * 0.05 + (state.badges.diamond >= 4 ? 0.1 : 0);
  const tower =
    1 +
    towerPerkCount(state, 7) * 0.1 +
    towerPerkCount(state, 9) * 0.05 +
    towerPerkCount(state, 4) * 0.1;
  return base * diamond * tower;""",
)

s = s.replace(
    "  const bonus = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);\n  return WISH_CHANCE * (1 + bonus);",
    "  const bonus = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);\n  return WISH_CHANCE * (1 + bonus);",
)

s = s.replace(
    "  if (starwish && Math.random() < STARWISH_CHANCE) {",
    "  const starChance =\n    STARWISH_CHANCE * (1 + towerPerkCount(prev, 2) * 0.5);\n  if (starwish && Math.random() < starChance) {",
)

s = s.replace(
    "  if (\n    prev.owned[targetId] &&\n    crystalReady(prev, now) &&\n    Math.random() < CRYSTAL_SPAWN_CHANCE\n  ) {\n    state.crystal = rollCrystal(prev.badges.sapphire >= 4 ? 1.25 : 1);",
    """  const spawnChance =
    CRYSTAL_SPAWN_CHANCE +
    towerPerkCount(prev, 3) * 0.1 +
    towerPerkCount(prev, 10) * 0.02;
  if (prev.owned[targetId] && crystalReady(prev, now) && Math.random() < spawnChance) {
    const valueMult =
      (prev.badges.sapphire >= 4 ? 1.25 : 1) * (1 + towerPerkCount(prev, 5) * 0.05);
    state.crystal = rollCrystal(valueMult);""",
)

s = s.replace(
    "  let bonus = 0;\n  if (prev.badges.bronze >= 4 && prev.wishes.includes(char.id)) bonus += 500;\n  if (prev.badges.emerald >= 4) bonus += rankValue(char.rank);",
    "  let bonus = towerPerkCount(prev, 6) * 50;\n  if (prev.badges.bronze >= 4 && prev.wishes.includes(char.id)) bonus += 500;\n  if (prev.badges.emerald >= 4) bonus += rankValue(char.rank);",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tower engine added")

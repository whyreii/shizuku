import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label, "|", old[:60]); sys.exit(1)
    s = s.replace(old, new)

# 1. wish / starwish rate: 2% -> 0.5%
rep("export const WISH_CHANCE = 0.02;", "export const WISH_CHANCE = 0.005;", "wish const")
rep("export const STARWISH_CHANCE = 0.02;", "export const STARWISH_CHANCE = 0.005;", "starwish const")

# 2. imports: tier helpers
rep('import { weightForRank } from "./tiers";',
    'import { clampShifts, tierForRank, weightForRank } from "./tiers";', "imports")

# 3. new fountain perk (12 is taken by colour unlocks)
rep('  { id: 12, label: "Colour unlocks", blurb: "+5 min off claim cooldown" },\n];',
    '  { id: 12, label: "Colour unlocks", blurb: "+5 min off claim cooldown" },\n'
    '  { id: 13, label: "Rarity lens", blurb: "+0.03pp S+ / +0.20pp S" },\n];', "perk 13")

# 4. rarity shifts + claim shards, next to the other derived stats
rep("export function wishCap(state: GameState): number {",
"""/**
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

export function wishCap(state: GameState): number {""", "rarity helpers")

# 5. weightedPick takes the shift count
rep("""function weightedPick(members: { id: string; rank: number }[]): string {
  let total = 0;
  for (const c of members) total += weightForRank(c.rank);
  let roll = Math.random() * total;
  for (const c of members) {
    roll -= weightForRank(c.rank);""",
"""function weightedPick(
  members: { id: string; rank: number }[],
  shifts = 0,
): string {
  let total = 0;
  for (const c of members) total += weightForRank(c.rank, shifts);
  let roll = Math.random() * total;
  for (const c of members) {
    roll -= weightForRank(c.rank, shifts);""", "weightedPick")

# 6. roll() uses the live shift count
rep("  let targetId: string | null = null;\n  let special: RollResult[\"special\"] = null;",
    "  const shifts = rarityShifts(prev);\n  let targetId: string | null = null;\n  let special: RollResult[\"special\"] = null;", "roll shifts")
rep("      targetId = weightedPick(wished);", "      targetId = weightedPick(wished, shifts);", "roll wish pick")
rep("  if (!targetId) targetId = weightedPick(members);", "  if (!targetId) targetId = weightedPick(members, shifts);", "roll pool pick")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("game.ts patched")
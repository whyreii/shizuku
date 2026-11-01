import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------------- types ----------------
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
old = "  lastDailyAt: number;"
if s.count(old) != 1:
    print("MISS lastDailyAt"); sys.exit(1)
s = s.replace(old, """  lastDailyAt: number;
  /** 1-4: how often your own cards are held back. 4 = 4x rarer (Mudae parity). */
  novelty: number;
  /** Rolls per hour spent on wish spawn chance. */
  wishBoost: number;""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---------------- engine ----------------
g = "src/engine/game.ts"
t = io.open(g, encoding="utf-8").read()

def rep(old, new, label):
    global t
    if t.count(old) != 1:
        print("MISS", label); sys.exit(1)
    t = t.replace(old, new)

# constants
rep("export const WISH_BASE_MULTIPLIER = 1;\nexport const STARWISH_BASE_MULTIPLIER = 1;",
"""export const WISH_BASE_MULTIPLIER = 1;
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
}""", "constants")

# wish / starwish multipliers, Mudae ceilings
rep("""export function wishMultiplier(state: GameState): number {
  const bonus = state.badges.silver * 1 + (state.badges.ruby >= 2 ? 1 : 0);
  return WISH_BASE_MULTIPLIER + bonus;
}""",
"""/** Mudae: Silver I-IV +25% each, Ruby II +50%, plus the wish boost investment. */
export function wishMultiplier(state: GameState): number {
  const badge = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_BASE_MULTIPLIER + badge + wishBoostPercent(state.wishBoost ?? 0) / 100;
}""", "wishMultiplier")

rep("""export function starwishMultiplier(state: GameState): number {
  return STARWISH_BASE_MULTIPLIER + towerPerkCount(state, 2) * 1;
}""",
"""/** Fountain perk 2 gives diminishing returns, like Mudae's tower. */
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
}""", "starwishMultiplier")

# rolls per hour pays for the boost
rep("  return ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls + towerPerkCount(state, 11);",
    "  const boost = Math.max(0, Math.round(state.wishBoost ?? 0));\n  return Math.max(1, ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls + towerPerkCount(state, 11) - boost);",
    "rollsPerReset")

# initial + hydrate defaults
rep("    lastDailyAt: 0,", "    lastDailyAt: 0,\n    novelty: NOVELTY_MAX,\n    wishBoost: 0,", "initial")

# owned weighting in roll()
rep("""  const wishSet = new Set(prev.wishes);
  const starId = prev.starwish;""",
"""  const wishSet = new Set(prev.wishes);
  const starId = prev.starwish;
  const novelty = noveltyFactor(prev);""", "roll novelty")

rep("""    let weight = weightForRank(c.rank, shifts);
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoost;
    total += weight;""",
"""    let weight = weightForRank(c.rank, shifts);
    if (prev.owned[c.id]) weight *= novelty;
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoostFactor;
    total += weight;""", "roll weights 1")

rep("""    let weight = weightForRank(c.rank, shifts);
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoost;
    draw -= weight;""",
"""    let weight = weightForRank(c.rank, shifts);
    if (prev.owned[c.id]) weight *= novelty;
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoostFactor;
    draw -= weight;""", "roll weights 2")

# rename the local wish multiplier variable to avoid clashing with the new boost helper
rep("  const wishBoost = wishMultiplier(prev);", "  const wishBoostFactor = wishMultiplier(prev);", "rename wish local")

# divorce strips 5% of shards at 21+
rep("  const payout = divorceValue(charId, keysFor(prev, charId));",
"""  const keysHeld = keysFor(prev, charId);
  const payout = divorceValue(charId, keysHeld);
  // Mudae: divorcing a character with 21+ keys removes 5% of them.
  const keysLost = keysHeld >= 21 ? Math.floor(keysHeld * 0.05) : 0;""", "divorce keys")

io.open(g, "w", encoding="utf-8", newline="\n").write(t)
print("engine patched")
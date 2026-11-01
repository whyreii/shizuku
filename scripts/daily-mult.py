import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label); sys.exit(1)
    s = s.replace(old, new)

# ---- constants: chances become multipliers; daily range + rolls ---------
rep("export const WISH_CHANCE = 0.005;\nexport const STARWISH_CHANCE = 0.005;",
    "export const WISH_MULTIPLIER = 5;\nexport const STARWISH_MULTIPLIER = 25;\n\n/** Daily: RNG kakigori with a floor, plus a stack of rolls. */\nexport const DAILY_MIN = 100;\nexport const DAILY_MAX = 300;\nexport const DAILY_ROLLS = 10;", "constants")

# ---- multipliers instead of chances ------------------------------------
rep("""/** Live starwish chance: base plus 50% per Fountain perk 2. */
export function starwishChance(state: GameState): number {
  return STARWISH_CHANCE * (1 + towerPerkCount(state, 2) * 0.5);
}""",
"""/** Starwish makes that one card this many times more likely. */
export function starwishMultiplier(state: GameState): number {
  return STARWISH_MULTIPLIER * (1 + towerPerkCount(state, 2) * 0.5);
}""", "starwish multiplier")

rep("""export function wishChance(state: GameState): number {
  const bonus = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_CHANCE * (1 + bonus);
}""",
"""/** Wished cards carry this much extra weight. */
export function wishMultiplier(state: GameState): number {
  const bonus = state.badges.silver * 0.5 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_MULTIPLIER * (1 + bonus);
}""", "wish multiplier")

# ---- daily: pre-rolled amount, pays rolls too --------------------------
rep("""export function dailyAmount(state: GameState): number {
  return 800 + state.power * 60 + totalKeys(state) * 20;
}""",
"""function rollDaily(): number {
  return DAILY_MIN + Math.floor(Math.random() * (DAILY_MAX - DAILY_MIN + 1));
}

/** The stored roll for this cycle - rolled once when the timer expires. */
export function dailyAmount(state: GameState): number {
  return state.dailyRoll > 0 ? state.dailyRoll : rollDaily();
}""", "dailyAmount")

rep("""  const amount = dailyAmount(prev);
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + amount,
    lastDailyAt: now,
    log: [...prev.log],
  };""",
"""  const amount = dailyAmount(prev);
  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + amount,
    // bonus rolls stack on top of the cap rather than being wasted
    rolls: prev.rolls + DAILY_ROLLS,
    dailyRoll: 0,
    lastDailyAt: now,
    log: [...prev.log],
  };""", "claimDaily body")

rep('  log(state, `daily +${Math.round(amount)} kakigori`, "info");',
    '  log(state, `daily +${Math.round(amount)} kakigori, +${DAILY_ROLLS} rolls`, "info");', "daily log")

# ---- tick rolls the daily when it comes due ----------------------------
rep("""  const derivedPower = Math.floor(totalKeys(prev) / 10);""",
"""  // Pre-roll the daily so the panel can show the exact amount before claiming.
  if (now >= prev.lastDailyAt + DAILY_MS && (prev.dailyRoll ?? 0) === 0) {
    state.dailyRoll = rollDaily();
    changed = true;
  }

  const derivedPower = Math.floor(totalKeys(prev) / 10);""", "tick daily roll")

# ---- starting state ----------------------------------------------------
rep("    kakigori: 0,", "    kakigori: 0,\n    dailyRoll: 0,", "initial dailyRoll")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("game.ts core patched")
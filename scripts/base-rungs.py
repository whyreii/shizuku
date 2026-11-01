import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label); sys.exit(1)
    s = s.replace(old, new)

# 1. Mudae's flat base-value rungs
rep("""export function characterValueValue(rank: number, level: number): number {
  return Math.round(rankValue(rank) * keyValueMultiplier(level));
}""",
"""/**
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
}""", "value fn")

# 2. divorce pays base only
rep("""export function divorceValue(charId: string): number {
  const char = characterById(charId);
  return char ? rankValue(char.rank) : 0;
}""",
"""/**
 * What releasing the card refunds: its base value plus the flat rungs, WITHOUT
 * the shard multiplier. Selling a heavily keyed card should not mint badges.
 */
export function divorceValue(charId: string, level = 0): number {
  const char = characterById(charId);
  return char ? rankValue(char.rank) + baseValueBonus(level) : 0;
}""", "divorceValue")

rep("  const payout = characterValueValue(char.rank, keysFor(prev, charId));",
    "  const payout = divorceValue(charId, keysFor(prev, charId));", "divorce payout")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 3. UI passes the level so the preview matches the payout
c = "src/components/CharacterSheet.tsx"
t = io.open(c, encoding="utf-8").read()
t = t.replace("divorceValue(char.id)", "divorceValue(char.id, keys)")
io.open(c, "w", encoding="utf-8", newline="\n").write(t)
print("base rungs in, divorce pays base only")
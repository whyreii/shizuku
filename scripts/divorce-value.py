import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

old = """/**
 * What releasing the card refunds: its base value plus the flat rungs, WITHOUT
 * the shard multiplier. Selling a heavily keyed card should not mint badges.
 */
export function divorceValue(charId: string, level = 0): number {
  const char = characterById(charId);
  return char ? rankValue(char.rank) + baseValueBonus(level) : 0;
}"""
new = """/** Releasing a card refunds exactly what it is worth right now. */
export function divorceValue(charId: string, level = 0): number {
  const char = characterById(charId);
  return char ? characterValueValue(char.rank, level) : 0;
}"""
if s.count(old) != 1:
    print("MISS divorceValue"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("divorce pays the displayed value")
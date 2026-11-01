import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# GameState gains dailyRoll
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
old = "  lastDailyAt: number;"
if s.count(old) != 1:
    print("MISS lastDailyAt"); sys.exit(1)
s = s.replace(old, "  lastDailyAt: number;\n  /** Pre-rolled kakigori for the current daily cycle. */\n  dailyRoll: number;")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# roll(): one weighted draw, wishes are multipliers
g = "src/engine/game.ts"
t = io.open(g, encoding="utf-8").read()

old_roll = """  const starwish = members.find((c) => c.id === prev.starwish);
  const starChance = starwishChance(prev);
  if (starwish && Math.random() < starChance) {
    targetId = starwish.id;
    special = "starwish";
  }

  if (!targetId) {
    const wished = members.filter((c) => prev.wishes.includes(c.id));
    if (wished.length > 0 && Math.random() < wishChance(prev)) {
      targetId = weightedPick(wished, shifts);
      special = "wish";
    }
  }

  if (!targetId) targetId = weightedPick(members, shifts);"""

new_roll = """  // One weighted draw. Wishes and the starwish carry extra weight instead of
  // overriding the pool, so the ladder still decides what is rare.
  const wishSet = new Set(prev.wishes);
  const starId = prev.starwish;
  const wishBoost = wishMultiplier(prev);
  const starBoost = starwishMultiplier(prev);

  let total = 0;
  for (const c of members) {
    let weight = weightForRank(c.rank, shifts);
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoost;
    total += weight;
  }
  let draw = Math.random() * total;
  targetId = members[members.length - 1].id;
  for (const c of members) {
    let weight = weightForRank(c.rank, shifts);
    if (starId && c.id === starId) weight *= starBoost;
    else if (wishSet.has(c.id)) weight *= wishBoost;
    draw -= weight;
    if (draw <= 0) {
      targetId = c.id;
      break;
    }
  }
  if (starId && targetId === starId) special = "starwish";
  else if (wishSet.has(targetId)) special = "wish";"""

if t.count(old_roll) != 1:
    print("MISS roll block"); sys.exit(1)
t = t.replace(old_roll, new_roll)

# weightedPick is now unused
start = t.index("function weightedPick(")
end = t.index("\n}\n", start) + len("\n}\n")
t = t[:start] + t[end:]
io.open(g, "w", encoding="utf-8", newline="\n").write(t)
print("roll rewritten as multipliers")
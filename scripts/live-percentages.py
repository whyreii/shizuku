import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---- 1. one source of truth for starwish chance -------------------------
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

old = """  const starwish = members.find((c) => c.id === prev.starwish);
  const starChance =
    STARWISH_CHANCE * (1 + towerPerkCount(prev, 2) * 0.5);"""
new = """  const starwish = members.find((c) => c.id === prev.starwish);
  const starChance = starwishChance(prev);"""
if s.count(old) != 1:
    print("MISS roll starChance"); sys.exit(1)
s = s.replace(old, new)

old2 = """export function wishChance(state: GameState): number {"""
new2 = """/** Live starwish chance: base plus 50% per Fountain perk 2. */
export function starwishChance(state: GameState): number {
  return STARWISH_CHANCE * (1 + towerPerkCount(state, 2) * 0.5);
}

export function wishChance(state: GameState): number {"""
if s.count(old2) != 1:
    print("MISS wishChance anchor"); sys.exit(1)
s = s.replace(old2, new2)

# ---- 2. new accounts start with nothing --------------------------------
if s.count("    kakigori: 2000,") != 1:
    print("MISS starting kakigori"); sys.exit(1)
s = s.replace("    kakigori: 2000,", "    kakigori: 0,")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("game.ts: starwishChance exported, new accounts start at 0")
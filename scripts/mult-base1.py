import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label); sys.exit(1)
    s = s.replace(old, new)

rep("export const WISH_MULTIPLIER = 5;\nexport const STARWISH_MULTIPLIER = 25;",
    "export const WISH_BASE_MULTIPLIER = 1;\nexport const STARWISH_BASE_MULTIPLIER = 1;", "bases")

rep("""export function starwishMultiplier(state: GameState): number {
  return STARWISH_MULTIPLIER * (1 + towerPerkCount(state, 2) * 0.5);
}""",
"""export function starwishMultiplier(state: GameState): number {
  return STARWISH_BASE_MULTIPLIER + towerPerkCount(state, 2) * 1;
}""", "starwish")

rep("""export function wishMultiplier(state: GameState): number {
  const bonus = state.badges.silver * 0.5 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_MULTIPLIER * (1 + bonus);
}""",
"""export function wishMultiplier(state: GameState): number {
  const bonus = state.badges.silver * 1 + (state.badges.ruby >= 2 ? 1 : 0);
  return WISH_BASE_MULTIPLIER + bonus;
}""", "wish")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# guide: say so plainly at x1
h = "src/components/HelpFab.tsx"
t = io.open(h, encoding="utf-8").read()
t = t.replace('`wished cards are ×${wishMultiplier(state).toFixed(1)} more likely, not guaranteed`,',
              'wishMultiplier(state) <= 1 ? "no wish boost yet - Silver earns it" : `wished cards are ×${wishMultiplier(state).toFixed(1)} more likely, not guaranteed`,')
t = t.replace('`one starwish comes first, ×${starwishMultiplier(state).toFixed(1)} weight`,',
              'starwishMultiplier(state) <= 1 ? "no starwish boost yet - the Fountain earns it" : `one starwish carries ×${starwishMultiplier(state).toFixed(1)} weight`,')
io.open(h, "w", encoding="utf-8", newline="\n").write(t)
print("multipliers now start at x1")
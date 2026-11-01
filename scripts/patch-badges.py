import io

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """export function wishCap(state: GameState): number {
  return BASE_WISHES + state.upgrades.wishes * 2;
}""",
    """export function wishCap(state: GameState): number {
  const badgeWishes = state.badges.bronze + (state.badges.ruby >= 1 ? 2 : 0);
  return BASE_WISHES + state.upgrades.wishes * 2 + badgeWishes;
}

/** Relative wish spawn multiplier from Silver and Ruby. */
export function wishChance(state: GameState): number {
  const bonus = state.badges.silver * 0.25 + (state.badges.ruby >= 2 ? 0.5 : 0);
  return WISH_CHANCE * (1 + bonus);
}""",
)

s = s.replace(
    """export function kakigoriPerHour(state: GameState): number {
  const soul = state.soulmateId ? 25 : 0;
  return 5 + totalKeys(state) * 12 + state.power * 3 + soul;
}""",
    """export function kakigoriPerHour(state: GameState): number {
  const soul = state.soulmateId ? 25 : 0;
  const base = 5 + totalKeys(state) * 12 + state.power * 3 + soul;
  const diamond =
    1 + state.badges.diamond * 0.05 + (state.badges.diamond >= 4 ? 0.1 : 0);
  return base * diamond;
}""",
)

s = s.replace(
    """    if (wished.length > 0 && Math.random() < WISH_CHANCE) {""",
    """    if (wished.length > 0 && Math.random() < wishChance(prev)) {""",
)

# crystal value scaling
s = s.replace(
    """  return {
    id: Math.random().toString(36).slice(2),
    color: picked.color,
    value: picked.value,""",
    """  return {
    id: Math.random().toString(36).slice(2),
    color: picked.color,
    value: picked.value,""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("effects patched")

import io

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

# power becomes derived from keys, so removing the shop does not orphan it
s = s.replace(
    "  if (now >= prev.nextResetAt) {",
    "  const derivedPower = Math.floor(totalKeys(prev) / 10);\n  if (derivedPower !== prev.power) {\n    state.power = derivedPower;\n    changed = true;\n  }\n\n  if (now >= prev.nextResetAt) {",
)

# claim cooldown driven by the Glacier badge
s = s.replace(
    "    CLAIM_COOLDOWN_MS - state.upgrades.claims * 10 * 60 * 1000,",
    "    CLAIM_COOLDOWN_MS - Math.max(0, state.badges.emerald - 1) * 10 * 60 * 1000,",
)

# wish slots: badges only
s = s.replace(
    "  return BASE_WISHES + state.upgrades.wishes * 2 + badgeWishes;",
    "  return BASE_WISHES + badgeWishes;",
)

# rolls: power + badges only
s = s.replace(
    "  return ROLLS_PER_RESET + state.upgrades.rolls * 2 + Math.floor(state.power / 5) + badgeRolls;",
    "  return ROLLS_PER_RESET + Math.floor(state.power / 5) + badgeRolls;",
)

# key cap from power
s = s.replace(
    "  return BASE_KEYS + state.upgrades.keys;",
    "  return BASE_KEYS + Math.floor(state.power / 2);",
)

# ice names
for old, new in [
    ("Bronze", "Sleet"),
    ("Silver", "Hail"),
    ("Gold", "Glaze"),
    ("Sapphire", "Frost"),
    ("Ruby", "Blizzard"),
    ("Emerald", "Glacier"),
    ("Diamond", "Aurora"),
]:
    s = s.replace(f'label: "{old}"', f'label: "{new}"')
    s = s.replace(f"needs {old} I +", f"needs {new} I +")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("ores renamed, shop effects folded")

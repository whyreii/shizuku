import io

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """  const state: GameState = {
    ...prev,
    nextClaimAt: now + claimCooldownMs(prev),""",
    """  let bonus = 0;
  if (prev.badges.bronze >= 4 && prev.wishes.includes(char.id)) bonus += 500;
  if (prev.badges.emerald >= 4) bonus += rankValue(char.rank);

  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + bonus,
    nextClaimAt: now + claimCooldownMs(prev),""",
)

s = s.replace(
    """  log(state, `claimed ${char.name}`, "claim");""",
    """  log(
    state,
    `claimed ${char.name}${bonus > 0 ? ` (+${Math.round(bonus)} kakigori)` : ""}`,
    "claim",
  );""",
)

# crystal value multiplier from Sapphire IV
s = s.replace(
    "function rollCrystal(): Crystal {",
    "function rollCrystal(multiplier: number): Crystal {",
)
s = s.replace(
    """    value: picked.value,""",
    """    value: Math.round(picked.value * multiplier),""",
)
s = s.replace(
    """    state.crystal = rollCrystal();""",
    """    state.crystal = rollCrystal(prev.badges.sapphire >= 4 ? 1.25 : 1);""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("claim + crystal patched")

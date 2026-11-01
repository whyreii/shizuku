import io

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

# --- keys: no cooldown, deep cap ------------------------------------------
s = s.replace(
    "export const KEY_COOLDOWN_MS = 60 * 60 * 1000;",
    "export const KEY_COOLDOWN_MS = 0; // Mudae: every owned roll adds a key\n  export const MAX_KEY_LEVEL = 500;",
)
s = s.replace(
    "export const BASE_KEYS = 10;",
    "export const BASE_KEYS = 10;",
)
s = s.replace(
    "export function keyCap(state: GameState): number {\n  return BASE_KEYS + Math.floor(state.power / 2);\n}",
    "export function keyCap(_state: GameState): number {\n  return MAX_KEY_LEVEL;\n}",
)

# --- grant a key on every owned roll --------------------------------------
s = s.replace(
    """  if (prev.owned[targetId]) {
    const record = prev.keys[targetId];
    const held = record?.keys ?? 0;
    const offCooldown = !record || now - record.lastKeyAt >= KEY_COOLDOWN_MS;
    if (held < keyCap(prev) && offCooldown) {""",
    """  if (prev.owned[targetId]) {
    const record = prev.keys[targetId];
    const held = record?.keys ?? 0;
    if (held < keyCap(prev)) {""",
)

# --- key level value bonuses ---------------------------------------------
s = s.replace(
    "/* ------------------------------------------------------------------ *\n * Kakera Tower",
    """/* ------------------------------------------------------------------ *
 * Key levels -> character value (Mudae reward table)
 * ------------------------------------------------------------------ */

/** +10% at levels 2/4/5/7/8/9, +5% per level from 11 up. */
export function keyValueMultiplier(level: number): number {
  let bonus = 0;
  for (const lvl of [2, 4, 5, 7, 8, 9]) {
    if (level >= lvl) bonus += 0.1;
  }
  if (level > 10) bonus += (level - 10) * 0.05;
  return 1 + bonus;
}

export function characterValueValue(rank: number, level: number): number {
  return Math.round(rankValue(rank) * keyValueMultiplier(level));
}

/* ------------------------------------------------------------------ *
 * Kakera Tower""",
)

s = s.replace(
    "    if (char) value += rankValue(char.rank);",
    "    if (char) value += characterValueValue(char.rank, keysFor(state, char.id));",
)

s = s.replace(
    "  const payout = rankValue(char.rank);",
    "  const payout = characterValueValue(char.rank, keysFor(prev, charId));",
)

# --- rarity: wish boost was far too generous ------------------------------
s = s.replace("export const WISH_CHANCE = 0.1;", "export const WISH_CHANCE = 0.02;")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("keys + rarity patched")

import io

# --- types: rolling-value payout window -----------------------------------
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "  crystal: Crystal | null;\n  lastCrystalAt: number;",
    "  crystal: Crystal | null;\n  lastCrystalAt: number;\n  /** Level-6 key payout: kakigori earned from rolling keyed cards, 3h window. */\n  valuePayout: { amount: number; windowStart: number };",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- game ------------------------------------------------------------------
g = "src/engine/game.ts"
t = io.open(g, encoding="utf-8").read()

t = t.replace(
    "    crystal: null,\n    lastCrystalAt: 0,",
    "    crystal: null,\n    lastCrystalAt: 0,\n    valuePayout: { amount: 0, windowStart: 0 },",
)

t = t.replace(
    "    lastCrystalAt: typeof raw.lastCrystalAt === \"number\" ? raw.lastCrystalAt : 0,",
    "    lastCrystalAt: typeof raw.lastCrystalAt === \"number\" ? raw.lastCrystalAt : 0,\n    valuePayout:\n      (raw.valuePayout as GameState[\"valuePayout\"]) ?? { amount: 0, windowStart: 0 },",
)

# key level helper + crystal rules
t = t.replace(
    "export function characterValueValue(rank: number, level: number): number {",
    """/** Crystal rules driven by a character's key level (Mudae reward table). */
export function crystalForCharacter(
  level: number,
  color: CrystalColor,
  baseValue: number,
): { color: CrystalColor; value: number; extra: boolean } {
  let nextColor = color;
  let value = baseValue;

  // L3: teal and green become orange.
  if (level >= 3 && (color === "teal" || color === "green")) {
    nextColor = "orange";
    value = Math.max(value, 750);
  }

  // L10: crystals on this character are worth more.
  if (level >= 10) value *= 1.5;

  // L50 / 200 / 400: purple, red and rainbow give more.
  if (nextColor === "purple" && level >= 50) value *= 1.75;
  if (nextColor === "red" && level >= 200) value *= 1.75;
  if (nextColor === "rainbow" && level >= 400) value *= 2;

  // L25 / 100 / 300 / 500: a second crystal can appear (represented as a double).
  const secondChance =
    level >= 500 ? 1 : level >= 300 ? 0.75 : level >= 100 ? 0.5 : level >= 25 ? 0.25 : 0;
  const extra = secondChance > 0 && Math.random() < secondChance;
  if (extra) value *= 2;

  return { color: nextColor, value: Math.round(value), extra };
}

/** L6: rolling a keyed character pays its value, capped per window. */
export const VALUE_PAYOUT_CAP = 4500;
export const VALUE_PAYOUT_WINDOW_MS = 3 * 60 * 60 * 1000;

export function characterValueValue(rank: number, level: number): number {""",
)

# roll(): key payout + crystal rules
t = t.replace(
    """  if (prev.owned[targetId]) {
    const record = prev.keys[targetId];
    const held = record?.keys ?? 0;
    if (held < keyCap(prev)) {""",
    """  if (prev.owned[targetId]) {
    const record = prev.keys[targetId];
    const held = record?.keys ?? 0;
    if (held < keyCap(prev)) {""",
)

t = t.replace(
    """  if (keyed) {
    state.current = { ...state.current!, keyed: true };
    state.stats = { ...state.stats, keys: state.stats.keys + 1 };
  }""",
    """  if (keyed) {
    state.current = { ...state.current!, keyed: true };
    state.stats = { ...state.stats, keys: state.stats.keys + 1 };
  }

  // L6: rolling a keyed character pays its value (capped, 3h window).
  if (prev.owned[targetId] && (prev.keys[targetId]?.keys ?? 0) >= 6) {
    const nowWindow = prev.valuePayout.windowStart + VALUE_PAYOUT_WINDOW_MS;
    const fresh = now >= nowWindow;
    const earnedSoFar = fresh ? 0 : prev.valuePayout.amount;
    const room = Math.max(0, VALUE_PAYOUT_CAP - earnedSoFar);
    if (room > 0) {
      const payout = Math.min(
        room,
        Math.round(rankValue(char.rank) * 0.25),
      );
      if (payout > 0) {
        state.kakigori = prev.kakigori + payout;
        state.valuePayout = {
          amount: earnedSoFar + payout,
          windowStart: fresh ? now : prev.valuePayout.windowStart,
        };
      }
    }
  }""",
)

io.open(g, "w", encoding="utf-8", newline="\n").write(t)
print("key rewards engine wired")

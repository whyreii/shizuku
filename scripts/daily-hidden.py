import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---- engine: roll at claim time, never pre-roll ------------------------
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace("""  // Pre-roll the daily so the panel can show the exact amount before claiming.
  if (now >= prev.lastDailyAt + DAILY_MS && (prev.dailyRoll ?? 0) === 0) {
    state.dailyRoll = rollDaily();
    changed = true;
  }

""", "")
s = s.replace("""export function dailyAmount(state: GameState): number {
  return state.dailyRoll > 0 ? state.dailyRoll : rollDaily();
}""",
"""/** Nothing is revealed until the player claims - the roll happens on click. */
export function dailyAmount(state: GameState): number {
  return state.dailyRoll > 0 ? state.dailyRoll : rollDaily();
}""")
s = s.replace("  const amount = dailyAmount(prev);", "  const amount = rollDaily();")
s = s.replace("""    rolls: prev.rolls + DAILY_ROLLS,
    dailyRoll: 0,""", """    rolls: prev.rolls + DAILY_ROLLS,
    dailyRoll: amount,""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---- panel: "claim", then reveal the amount after the click -----------
b = "src/components/BadgesPanel.tsx"
t = io.open(b, encoding="utf-8").read()
t = t.replace("  dailyAmount,\n", "")
old = """        <button
          type="button"
          className="ledger-row"
          disabled={dailyAvailable(state, Date.now()) > 0}
          onClick={() => act((s, t) => claimDaily(s, t))}
        >
          <span className="ledger-name">daily</span>
          <span className="badge-level" />
          <span className="ledger-cost">
            {dailyAvailable(state, Date.now()) > 0
              ? formatCountdown(dailyAvailable(state, Date.now()))
              : `+${formatKakera(dailyAmount(state))} · +${DAILY_ROLLS} rolls`}
          </span>
        </button>"""
new = """        <button
          type="button"
          className="ledger-row"
          disabled={dailyAvailable(state, Date.now()) > 0}
          onClick={() => {
            const before = state.kakigori;
            const next = act((s, t) => claimDaily(s, t));
            if (next) setJustClaimed(Math.round(next.kakigori - before));
          }}
        >
          <span className="ledger-name">daily</span>
          <span className="badge-level" />
          <span className="ledger-cost">
            {dailyAvailable(state, Date.now()) > 0
              ? formatCountdown(dailyAvailable(state, Date.now()))
              : justClaimed !== null
                ? `+${formatKakera(justClaimed)} · +${DAILY_ROLLS} rolls`
                : "claim"}
          </span>
        </button>"""
if t.count(old) != 1:
    print("MISS daily row"); sys.exit(1)
t = t.replace(old, new)
t = t.replace("  const [open, setOpen] = useState<BadgeKey | null>(null);",
              "  const [open, setOpen] = useState<BadgeKey | null>(null);\n  const [justClaimed, setJustClaimed] = useState<number | null>(null);")
io.open(b, "w", encoding="utf-8", newline="\n").write(t)
print("daily now reveals only after the click")
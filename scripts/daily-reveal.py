import io, sys
sys.stdout.reconfigure(encoding="utf-8")
b = "src/components/BadgesPanel.tsx"
t = io.open(b, encoding="utf-8").read()

old = """            {dailyAvailable(state, Date.now()) > 0
              ? formatCountdown(dailyAvailable(state, Date.now()))
              : justClaimed !== null
                ? `+${formatKakera(justClaimed)} · +${DAILY_ROLLS} rolls`
                : "claim"}"""
new = """            {justClaimed !== null
              ? `+${formatKakera(justClaimed)} · +${DAILY_ROLLS} rolls`
              : dailyAvailable(state, Date.now()) > 0
                ? formatCountdown(dailyAvailable(state, Date.now()))
                : "claim"}"""
if t.count(old) != 1:
    print("MISS label order"); sys.exit(1)
t = t.replace(old, new)

old2 = """            const next = act((s, t) => claimDaily(s, t));
            if (next) setJustClaimed(Math.round(next.kakigori - before));"""
new2 = """            const next = act((s, t) => claimDaily(s, t));
            if (next) {
              setJustClaimed(Math.round(next.kakigori - before));
              // reveal the roll, then fall back to the countdown
              window.setTimeout(() => setJustClaimed(null), 4000);
            }"""
if t.count(old2) != 1:
    print("MISS click handler"); sys.exit(1)
t = t.replace(old2, new2)
io.open(b, "w", encoding="utf-8", newline="\n").write(t)
print("reveal shows for 4s after the click")
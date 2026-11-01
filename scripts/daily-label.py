import io, sys
sys.stdout.reconfigure(encoding="utf-8")
b = "src/components/BadgesPanel.tsx"
t = io.open(b, encoding="utf-8").read()
old = ": `+${formatKakera(dailyAmount(state))}`}"
new = ": `+${formatKakera(dailyAmount(state))} · +${DAILY_ROLLS} rolls`}"
if t.count(old) != 1:
    print("MISS daily label"); sys.exit(1)
t = t.replace(old, new)
io.open(b, "w", encoding="utf-8", newline="\n").write(t)
print("daily label updated")
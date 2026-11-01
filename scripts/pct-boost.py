import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

old = "<b>×{wishMultiplier(state).toFixed(1)}</b>"
new = "<b>+{Math.round((wishMultiplier(state) - 1) * 100)}%</b>"
if s.count(old) != 1:
    print("MISS wish"); sys.exit(1)
s = s.replace(old, new)

old2 = "<b>×{starwishMultiplier(state).toFixed(1)}</b>"
new2 = "<b>+{Math.round((starwishMultiplier(state) - 1) * 100)}%</b>"
if s.count(old2) != 1:
    print("MISS star"); sys.exit(1)
s = s.replace(old2, new2)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("panel: multipliers shown as percentage lift")
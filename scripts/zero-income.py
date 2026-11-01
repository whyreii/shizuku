import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()
old = "  const base = 5 + totalKeys(state) * 12 + state.power * 3 + soul;"
new = "  // No free income: every kakigori comes from shards, power or a soulmate.\n  const base = totalKeys(state) * 12 + state.power * 3 + soul;"
if s.count(old) != 1:
    print("MISS income base"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("base income 5 -> 0")
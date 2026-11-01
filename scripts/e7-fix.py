import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()
old = """  const keysHeld = keysFor(prev, charId);
  const payout = divorceValue(charId, keysHeld);
  // Mudae: divorcing a character with 21+ keys removes 5% of them.
  const keysLost = keysHeld >= 21 ? Math.floor(keysHeld * 0.05) : 0;
  const keysOwned = keysFor(prev, charId);"""
new = """  const keysHeld = keysFor(prev, charId);
  const payout = divorceValue(charId, keysHeld);
  const keysOwned = keysHeld;"""
if s.count(old) != 1:
    print("MISS"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("dedup removed")
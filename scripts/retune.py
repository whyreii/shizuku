import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/tiers.ts"
s = io.open(p, encoding="utf-8").read()
old = """export const POOL_RATES: Record<Tier, number> = {
  "S+": 0.02,
  S: 0.3,
  A: 3,
  B: 14,
  C: 32,
  D: 50.68,
};"""
new = """export const POOL_RATES: Record<Tier, number> = {
  "S+": 0.02,
  S: 0.3,
  A: 1.2,
  B: 4,
  C: 10,
  D: 84.48,
};"""
if s.count(old) != 1:
    print("MISS rates"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("retuned: A 3->1.2, B 14->4, C 32->10, D 50.68->84.48")
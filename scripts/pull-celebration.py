import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# The pull is the event: sparkles and the foil sweep fire on reveal, not ownership.
c = "src/components/Card3D.tsx"
s = io.open(c, encoding="utf-8").read()
old = "{owned && tier === \"S+\" ? ("
new = "{tier === \"S+\" ? ("
if s.count(old) != 1:
    print("MISS sparkle gate"); sys.exit(1)
s = s.replace(old, new)
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

st = "src/styles.css"
t = io.open(st, encoding="utf-8").read()
for a, b in [
    (".card3d.is-owned.tier-sp .card3d-inner::after {", ".card3d.tier-sp .card3d-inner::after {"),
    (".card3d.is-owned.tier-s .card3d-inner::after {", ".card3d.tier-s .card3d-inner::after {"),
]:
    n = t.count(a)
    print(a[:44], "->", n, "occurrence(s)")
    t = t.replace(a, b)
io.open(st, "w", encoding="utf-8", newline="\n").write(t)
print("celebration moved to the pull")
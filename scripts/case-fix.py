import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
# rarity chip: S+ stays uppercase, count stays as-is
old = "                {tier.toLowerCase()} {tierCounts[tier] ?? 0}"
new = "                {tier} {tierCounts[tier] ?? 0}"
if t.count(old) != 1:
    print("MISS chips"); sys.exit(1)
t = t.replace(old, new)
# roll button: sentence case in markup, no auto-capitalisation
old2 = "            <span>roll &nbsp;·&nbsp; 893 left</span>"
new2 = "            <span>Roll &nbsp;·&nbsp; 893 left</span>"
if t.count(old2) != 1:
    print("MISS roll"); sys.exit(1)
t = t.replace(old2, new2)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
s = s.replace("""  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: capitalize;
  color: #06121c;""", """  font-weight: 700;
  letter-spacing: 0.08em;
  color: #06121c;""")
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("chips + button fixed")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = "  align-content: start; gap: 16px; min-height: 0;"
new = "  align-content: start; gap: 16px; min-height: 0; overflow-anchor: none;"
print("found:", s.count(old))
if s.count(old) != 1:
    sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("scroll anchoring disabled on the shelf")
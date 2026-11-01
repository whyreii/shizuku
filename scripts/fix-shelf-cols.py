import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = "grid-template-columns: repeat(6, minmax(0,1fr));"
new = "grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));"
print("found:", s.count(old))
if s.count(old) != 1:
    sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("shelf is now fluid")
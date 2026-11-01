import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

old = """            <span className="gf-hour">
              <span className="gf-pips" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <i key={i} className="on" />
                ))}
              </span>
              this hour
            </span>"""
new = """            <span className="gf-hour">
              <b>10/10</b>
              this hour
            </span>"""
if s.count(old) != 1:
    print("MISS hour"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("pips -> 10/10")
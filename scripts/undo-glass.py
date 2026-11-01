import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

start = s.index("/* Frosted glass: the backdrop is the blurred card art")
end = s.index(".gf-pill > * { position: relative; z-index: 1; }") + len(".gf-pill > * { position: relative; z-index: 1; }")
new = """.gf-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 6px 0 13px;
  border-radius: 999px;
  border: 1px solid rgba(154, 217, 255, 0.22);
  background: rgba(10, 16, 24, 0.62);
}"""
s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("glass reverted")
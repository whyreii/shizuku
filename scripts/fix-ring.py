import io, sys
sys.stdout.reconfigure(encoding="utf-8")

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
start = s.index(".gf-stage.is-top3 .gf-hero {")
end = s.index(".gf-stage.is-top3 .gf-peek {")
new = """/* Top three, quiet version: a hairline silhouette plus a wide, low bloom.
   The colour identifies it - not the brightness. */
.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter:
    drop-shadow(0 0 1px rgba(195, 168, 255, 0.55))
    drop-shadow(-5px 0 30px rgba(154, 217, 255, 0.17))
    drop-shadow(5px 0 30px rgba(195, 168, 255, 0.15))
    drop-shadow(0 6px 34px rgba(111, 227, 180, 0.1));
}

"""
s = s[:start] + new + s[end:]
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
ring = '            {isTop3 ? <div className="gf-ring" aria-hidden="true" /> : null}\n'
if ring in t:
    t = t.replace(ring, "")
io.open(p, "w", encoding="utf-8", newline="\n").write(t)
print("ring removed, hairline silhouette in")
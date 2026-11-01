import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------- CSS ----------
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()

start = s.index(".gf-stage.is-top3 .gf-hero {")
end = s.index(".gf-stage.is-top3 .gf-peek {")
new = """/* Top three, quiet version: a wide low-alpha bloom plus a hairline aurora
   ring. The colour identifies it - not the brightness. */
.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter:
    drop-shadow(-4px 0 34px rgba(154, 217, 255, 0.16))
    drop-shadow(4px 0 34px rgba(195, 168, 255, 0.14))
    drop-shadow(0 4px 30px rgba(111, 227, 180, 0.1));
}

.gf-ring {
  position: absolute;
  inset: -7px;
  z-index: 3;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(
    115deg,
    rgba(154, 217, 255, 0.85),
    rgba(195, 168, 255, 0.8),
    rgba(111, 227, 180, 0.7),
    rgba(255, 217, 138, 0.6),
    rgba(154, 217, 255, 0.85)
  );
  background-size: 220% 100%;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  animation: gf-ring-drift 14s linear infinite;
  pointer-events: none;
}

@keyframes gf-ring-drift {
  from { background-position: 0% 50%; }
  to { background-position: 200% 50%; }
}

"""
s = s[:start] + new + s[end:]
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

# ---------- TSX: draw the ring for top three ----------
p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = "            {isTop3 ? <div className=\"gf-crest\">№ {hero.char.rank}</div> : null}"
new = ("            {isTop3 ? <div className=\"gf-ring\" aria-hidden=\"true\" /> : null}\n"
       "            {isTop3 ? <div className=\"gf-crest\">№ {hero.char.rank}</div> : null}")
if t.count(old) != 1:
    print("MISS crest anchor"); sys.exit(1)
t = t.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)
print("subtle top-3 treatment in")
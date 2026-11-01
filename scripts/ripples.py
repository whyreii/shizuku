import io, sys
sys.stdout.reconfigure(encoding="utf-8")

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()

# top three: drop the light entirely - the water does the talking
start = s.index("/* Top three, quiet version: a hairline silhouette plus a wide, low bloom.")
end = s.index(".gf-stage.is-top3 .gf-peek {")
new = """/* Top three: no bloom. The card breaks the surface instead - ripples spread
   from its base. Nothing is painted behind the card, so the artwork is never
   tinted, and the light level stays flat. */
.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter: drop-shadow(0 0 1px rgba(195, 168, 255, 0.45));
}

.gf-water {
  position: absolute;
  left: 50%;
  bottom: -6px;
  z-index: 0;
  width: 260px;
  height: 54px;
  transform: translateX(-50%);
  pointer-events: none;
}

.gf-water span {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 100%;
  height: 54px;
  border-radius: 50%;
  border: 1px solid rgba(154, 217, 255, 0.55);
  box-shadow: 0 0 10px -3px rgba(154, 217, 255, 0.5);
  transform: translateX(-50%) scale(0.3);
  opacity: 0;
  animation: gf-ripple 7.2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
}

.gf-water span:nth-child(2) { animation-delay: 2.4s; }
.gf-water span:nth-child(3) { animation-delay: 4.8s; }

@keyframes gf-ripple {
  0% { transform: translateX(-50%) scale(0.28); opacity: 0; }
  12% { opacity: 0.5; }
  70% { opacity: 0.14; }
  100% { transform: translateX(-50%) scale(1.18); opacity: 0; }
}

"""
s = s[:start] + new + s[end:]
s = s.replace(".gf-stage.is-top3 .gf-hero { animation: none; }",
              ".gf-stage.is-top3 .gf-hero, .gf-water span { animation: none; }")
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = '            {isTop3 ? <div className="gf-crest">№ {hero.char.rank}</div> : null}'
new = ('            {isTop3 ? (\n'
       '              <div className="gf-water" aria-hidden="true">\n'
       '                <span />\n                <span />\n                <span />\n'
       '              </div>\n'
       '            ) : null}\n'
       + old)
if t.count(old) != 1:
    print("MISS"); sys.exit(1)
t = t.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)
print("ripples in, glow out")
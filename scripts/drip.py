import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---- TSX: drop the crest, add the drips --------------------------------
p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = '            {isTop3 ? <div className="gf-crest"><span>№ {hero.char.rank}</span></div> : null}\n'
if old not in t:
    print("MISS crest line"); sys.exit(1)
t = t.replace(old, "")
old2 = """            {isTop3 ? (
              <div className="gf-water" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}"""
new2 = """            {isTop3 ? (
              <>
                <div className="gf-water" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="gf-drips" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </>
            ) : null}"""
if t.count(old2) != 1:
    print("MISS water block"); sys.exit(1)
t = t.replace(old2, new2)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)

# ---- CSS: remove crest, add drip cycle ---------------------------------
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
start = s.index("/* The crest is a shard, not a pill")
end = s.index("@media (prefers-reduced-motion: reduce) {", start)
drip = """/* The drop is the identity: Shizuku means "drip". A bead forms under the card,
   falls, and the ring spreads from where it lands - so the water has a cause
   instead of pulsing for no reason. */
.gf-drips {
  position: absolute;
  left: 50%;
  top: 100%;
  z-index: 3;
  width: 0;
  height: 0;
  pointer-events: none;
}

.gf-drips span {
  position: absolute;
  left: -3px;
  top: -3px;
  width: 6px;
  height: 8px;
  border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%;
  background: linear-gradient(180deg, #eaf8ff, #8fd4ff);
  box-shadow: 0 0 8px rgba(154, 217, 255, 0.55);
  opacity: 0;
  animation: gf-drip 7.2s cubic-bezier(0.4, 0.1, 0.7, 1) infinite;
}

.gf-drips span:nth-child(2) { animation-delay: 2.4s; }
.gf-drips span:nth-child(3) { animation-delay: 4.8s; }

@keyframes gf-drip {
  0% { opacity: 0; transform: translateY(-9px) scaleY(0.7); }
  3% { opacity: 0.9; transform: translateY(-4px) scaleY(0.9); }
  7% { opacity: 0.95; transform: translateY(-1px) scaleY(1.15); }
  10% { opacity: 0.95; transform: translateY(9px) scaleY(1.35); }
  11% { opacity: 0; transform: translateY(14px) scaleY(0.9); }
  100% { opacity: 0; }
}

"""
s = s[:start] + drip + s[end:]
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("crest removed, drip cycle added")
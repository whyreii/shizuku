import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------- TSX: flag the hero when it is top three ----------------------
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

old = '  const heroTier = tierForRank(hero.char.rank);'
new = '  const heroTier = tierForRank(hero.char.rank);\n  const isTop3 = hero.char.rank <= 3;'
if s.count(old) != 1:
    print("MISS heroTier"); sys.exit(1)
s = s.replace(old, new)

old = '        <section\n          className="gf-stage"'
new = '        <section\n          className={`gf-stage${isTop3 ? " is-top3" : ""}`}'
if s.count(old) != 1:
    print("MISS stage"); sys.exit(1)
s = s.replace(old, new)

old = """            <div className="gf-hero">
              <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
            </div>"""
new = """            <div className="gf-hero">
              <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
            </div>
            {isTop3 ? <div className="gf-crest">№ {hero.char.rank}</div> : null}"""
if s.count(old) != 1:
    print("MISS crest"); sys.exit(1)
s = s.replace(old, new)

s = s.replace("preview v3 · frame only, cards unchanged", "preview v3 · top three: aurora frame (card untouched)")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tsx wired")

# ---------- CSS: aurora aura + engraved crest ---------------------------
c = "src/preview.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* ---------------------------------------------------------------
   Top three. The card is frozen, so the whole signal lives in the
   frame: the stage glow goes prismatic and the deck gets a crest.
   --------------------------------------------------------------- */
.gf-stage.is-top3 .gf-aura {
  background: conic-gradient(
    from 0deg,
    rgba(154, 217, 255, 0.5),
    rgba(195, 168, 255, 0.46),
    rgba(111, 227, 180, 0.4),
    rgba(255, 217, 138, 0.36),
    rgba(154, 217, 255, 0.5)
  );
  filter: blur(24px);
  animation: gf-aurora 16s linear infinite;
}

@keyframes gf-aurora {
  from { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.04); }
  to { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
}

.gf-stage.is-top3 .gf-peek {
  border-color: rgba(195, 168, 255, 0.3);
}

/* engraved plate, sitting outside the card so nothing is added to it */
.gf-crest {
  position: absolute;
  left: 50%;
  top: -38px;
  transform: translateX(-50%);
  padding: 5px 14px 6px;
  border-radius: 999px;
  border: 1px solid transparent;
  background-image:
    linear-gradient(rgba(7, 11, 18, 0.86), rgba(7, 11, 18, 0.86)),
    linear-gradient(100deg, #9ad9ff, #c3a8ff, #6fe3b4, #ffd98a);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  font-family: var(--serif);
  font-size: 14px;
  letter-spacing: 0.08em;
  color: #f4fbff;
  box-shadow: 0 0 26px -10px #c3a8ff;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .gf-stage.is-top3 .gf-aura { animation: none; }
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("css appended")
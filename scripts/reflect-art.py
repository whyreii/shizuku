import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = """            <div className="gf-mirror">
              <div className="gf-hero">
                <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
              </div>
            </div>"""
new = """            <div className="gf-mirror">
              <div className="gf-hero">
                <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
              </div>
              {isTop3 ? (
                <div className="gf-reflection" aria-hidden="true">
                  <img src={hero.portrait} alt="" />
                </div>
              ) : null}
            </div>"""
if t.count(old) != 1:
    print("MISS hero block"); sys.exit(1)
t = t.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
start = s.index("/* the mirror lives on the wrapper: -webkit-box-reflect is ignored on an element")
end = s.index("/* room for the reflection so it never collides with the roll button */")
new = """/* The mirror is the card's own art flipped into the water. -webkit-box-reflect
   is not available in this engine (CSS.supports returns false), so the band is
   built from the portrait itself. */
.gf-reflection {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 92px;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.22) 46%,
    transparent 82%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.22) 46%,
    transparent 82%
  );
}

.gf-reflection img {
  position: absolute;
  left: 0;
  width: 100%;
  height: 402px;
  object-fit: cover;
  object-position: center 12%;
  top: -402px;
  transform: scaleY(-1);
  transform-origin: 50% 100%;
  filter: blur(2.5px) saturate(0.85) brightness(0.75);
}

"""
s = s[:start] + new + s[end:]
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("reflection built from the art")
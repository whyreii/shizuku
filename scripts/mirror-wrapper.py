import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = """            <div className="gf-hero">
              <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
            </div>"""
new = """            <div className="gf-mirror">
              <div className="gf-hero">
                <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
              </div>
            </div>"""
if t.count(old) != 1:
    print("MISS hero"); sys.exit(1)
t = t.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
s = s.replace(""".gf-hero {
  position: absolute;
  inset: 0;
  z-index: 2;
}""",
""".gf-mirror { position: absolute; inset: 0; z-index: 2; }
.gf-hero { position: absolute; inset: 0; }""")

s = s.replace("""  /* the reflection is a gradient-masked mirror: it fades inside ~10% so it
     reads as water, not a second card */
  -webkit-box-reflect: below 3px linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.26),
    rgba(255, 255, 255, 0.07) 45%,
    transparent 72%
  );
}""", """}""")

s = s.replace("""/* room for the reflection so it never collides with the roll button */""",
"""/* the mirror lives on the wrapper: -webkit-box-reflect is ignored on an element
   that also has a filter, which is why it did nothing on .gf-hero */
.gf-stage.is-top3 .gf-mirror {
  -webkit-box-reflect: below 4px linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.08) 42%,
    transparent 70%
  );
}

/* room for the reflection so it never collides with the roll button */""")
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("mirror moved to wrapper")
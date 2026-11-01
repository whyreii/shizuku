import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

start = s.index("/* The glow must never sit behind the card")
end = s.index(".gf-hero .card-scene { width: 100%; height: 100%; }") + len(".gf-hero .card-scene { width: 100%; height: 100%; }")
new = """/* No glow at all. The card already states its tier three times - chip, ring,
   value colour - so a fourth copy in the frame was loud for no new information.
   The stage stays flat; only top three gets water. */
.gf-hero {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.gf-hero .card-scene { width: 100%; height: 100%; }"""
s = s[:start] + new + s[end:]

s = s.replace(""".gf-stage.is-top3 .gf-hero {
  animation: none;
  filter: drop-shadow(0 0 1px rgba(195, 168, 255, 0.45));
}""", """.gf-stage.is-top3 .gf-hero { animation: none; }""")

s = s.replace(".gf-hero, .gf-roll::after { animation: none; }",
              ".gf-water span, .gf-roll::after { animation: none; }")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("glow removed everywhere")
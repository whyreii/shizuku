import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

old_start = s.index(".gf-stage.is-top3 .gf-aura {")
old_end = s.index("@keyframes gf-aurora {")
new_block = """.gf-stage.is-top3 .gf-aura {
  background: conic-gradient(
    from 0deg,
    rgba(154, 217, 255, 0.34),
    rgba(195, 168, 255, 0.3),
    rgba(111, 227, 180, 0.26),
    rgba(255, 217, 138, 0.22),
    rgba(154, 217, 255, 0.34)
  );
  filter: blur(18px);
  /* A halo, not a backlight: clear through the middle so the colour never
     washes over the character, strongest just outside the card edge. */
  mask-image: radial-gradient(
    circle,
    transparent 34%,
    rgba(0, 0, 0, 0.5) 44%,
    #000 52%,
    rgba(0, 0, 0, 0.45) 61%,
    transparent 68%
  );
  -webkit-mask-image: radial-gradient(
    circle,
    transparent 34%,
    rgba(0, 0, 0, 0.5) 44%,
    #000 52%,
    rgba(0, 0, 0, 0.45) 61%,
    transparent 68%
  );
  animation: gf-aurora 16s linear infinite;
}

"""
s = s[:old_start] + new_block + s[old_end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("halo mask applied")
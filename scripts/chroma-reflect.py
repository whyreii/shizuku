import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

old = ".gf-stage.is-top3 .gf-hero { animation: none; }"
new = """/* 2 + 4. The edge splits light like a prism, and the card is mirrored in the
   water below it. Both live outside the card - neither paints on the art. */
.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter:
    drop-shadow(1.4px 0 0 rgba(255, 74, 122, 0.55))
    drop-shadow(-1.4px 0 0 rgba(88, 198, 255, 0.6))
    drop-shadow(0 1.2px 0 rgba(150, 255, 214, 0.35));
  /* the reflection is a gradient-masked mirror: it fades inside ~10% so it
     reads as water, not a second card */
  -webkit-box-reflect: below 3px linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.26),
    rgba(255, 255, 255, 0.07) 45%,
    transparent 72%
  );
}

/* room for the reflection so it never collides with the roll button */
.gf-stage.is-top3 .gf-deck { margin-bottom: 34px; }"""
if s.count(old) != 1:
    print("MISS"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("chromatic edge + reflection in")
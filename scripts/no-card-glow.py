import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
s += """

/* Preview-only override: the card's own S+ tier glow is defined in styles.css
   (.reveal-sp .card3d-inner -> 0 0 42px -8px var(--tier)). Suppressed here so
   the stage can be judged with zero light. This does NOT change the card. */
.gf-hero .card3d-inner {
  box-shadow: 0 22px 48px -30px #000 !important;
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("card tier glow suppressed in the preview only")
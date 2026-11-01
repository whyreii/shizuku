import io

# sparkles belong to S+ only
p = "src/components/Card3D.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    '{owned && (tier === "S+" || tier === "S") ? (',
    '{owned && tier === "S+" ? (',
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# static sheen for the S band
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* S band: a fixed foil sheen — no animation, so it never competes with S+ */
.card3d.is-owned.tier-s .card3d-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    118deg,
    transparent 34%,
    rgba(255, 255, 255, 0.14) 47%,
    rgba(255, 255, 255, 0.05) 56%,
    transparent 68%
  );
  pointer-events: none;
  z-index: 5;
}

@media (prefers-reduced-motion: reduce) {
  .card3d.is-owned.tier-sp .card3d-inner::after {
    animation: none;
  }
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("S sheen added, sparkles limited to S+")

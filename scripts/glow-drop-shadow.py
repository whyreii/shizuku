import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------- CSS: glow leaves the backdrop, becomes a silhouette shadow -----
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()

start = s.index(".gf-aura {")
end = s.index(".gf-hero .card-scene { width: 100%; height: 100%; }") + len(".gf-hero .card-scene { width: 100%; height: 100%; }")
replacement = """/* The glow must never sit behind the card: the card's holo (soft-light) and
   glare (overlay) layers blend with the page backdrop, so a backdrop glow ends
   up washed across the character. A drop-shadow follows the card's silhouette
   instead - it can only paint outside it. */
.gf-hero {
  position: absolute;
  inset: 0;
  z-index: 2;
  --glow: color-mix(in srgb, var(--hero-tier) 34%, transparent);
  filter: drop-shadow(0 0 26px var(--glow));
  animation: gf-glow 6s ease-in-out infinite;
}

@keyframes gf-glow {
  0%, 100% { filter: drop-shadow(0 0 18px var(--glow)); }
  50% { filter: drop-shadow(0 0 34px var(--glow)); }
}

.gf-hero .card-scene { width: 100%; height: 100%; }"""
s = s[:start] + replacement + s[end:]

# ---------- top three: the same shadow, prismatic --------------------------
start = s.index(".gf-stage.is-top3 .gf-aura {")
end = s.index(".gf-stage.is-top3 .gf-peek {")
replacement = """.gf-stage.is-top3 .gf-hero {
  animation: gf-aurora 11s ease-in-out infinite;
}

@keyframes gf-aurora {
  0%, 100% {
    filter:
      drop-shadow(-10px 0 22px rgba(154, 217, 255, 0.5))
      drop-shadow(10px 0 22px rgba(195, 168, 255, 0.46))
      drop-shadow(0 8px 26px rgba(111, 227, 180, 0.28));
  }
  50% {
    filter:
      drop-shadow(-10px 0 22px rgba(111, 227, 180, 0.44))
      drop-shadow(10px 0 22px rgba(154, 217, 255, 0.48))
      drop-shadow(0 8px 26px rgba(255, 217, 138, 0.24));
  }
}

"""
s = s[:start] + replacement + s[end:]

s = s.replace(".gf-aura, .gf-roll::after { animation: none; }",
              ".gf-hero, .gf-roll::after { animation: none; }")
s = s.replace("  .gf-stage.is-top3 .gf-aura { animation: none; }",
              "  .gf-stage.is-top3 .gf-hero { animation: none; }")
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

# ---------- TSX: the aura element is gone ---------------------------------
p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
if '            <div className="gf-aura" />\n' in t:
    t = t.replace('            <div className="gf-aura" />\n', "")
io.open(p, "w", encoding="utf-8", newline="\n").write(t)
print("glow moved to a silhouette drop-shadow; aura element removed")
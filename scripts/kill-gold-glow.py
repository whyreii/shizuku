import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# 1. the static S+ halo on every S+ card
old1 = """.reveal-sp .card3d-inner {
  box-shadow:
    0 22px 48px -24px #000,
    0 0 42px -8px var(--tier);
}"""
new1 = """/* No tier halo on the card. Tier is already stated by the chip, the border
   ring and the value colour; a 42px glow was a fourth copy of the same fact. */
.reveal-sp .card3d-inner {
  box-shadow: 0 22px 48px -24px #000;
}"""
if s.count(old1) != 1:
    print("MISS static glow"); sys.exit(1)
s = s.replace(old1, new1)

# 2. the owning pulse for S+ / S
old2 = """.card3d.is-owned.tier-sp .card3d-inner {
  animation: tier-glow 3.4s ease-in-out infinite;
}

.card3d.is-owned.tier-s .card3d-inner {
  animation: tier-glow 4.6s ease-in-out infinite;
}

@keyframes tier-glow {
  0%,
  100% {
    box-shadow:
      0 22px 44px -24px #000,
      0 0 26px -14px var(--tier);
  }
  50% {
    box-shadow:
      0 22px 44px -24px #000,
      0 0 46px -6px var(--tier);
  }
}

"""
if s.count(old2) != 1:
    print("MISS owned pulse"); sys.exit(1)
s = s.replace(old2, "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("gold glow removed from the card (styles.css)")

# 3. the preview-only override is obsolete now that the source is fixed
c = "src/preview.css"
t = io.open(c, encoding="utf-8").read()
start = t.find("/* Preview-only override: the card's own S+ tier glow")
if start != -1:
    t = t[:start].rstrip() + "\n"
    io.open(c, "w", encoding="utf-8", newline="\n").write(t)
    print("preview override removed - preview and app now share one source")
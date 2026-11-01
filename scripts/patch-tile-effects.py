import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# hairline borders on tiles, tier only tints them
s = s.replace(
    """.tile-art {
  position: relative;
  aspect-ratio: 63/88;
  border-radius: 10px;
  overflow: hidden;
  background: #0d141d;
  border: 1px solid var(--line);
}""",
    """.tile-art {
  position: relative;
  aspect-ratio: 63/88;
  border-radius: 10px;
  overflow: hidden;
  background: #0d141d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}""",
)

s = s.replace(
    """.tile.tier-sp .tile-art { border-color: var(--tier-sp); }
.tile.tier-s .tile-art { border-color: var(--tier-s); }
.tile.tier-a .tile-art { border-color: var(--tier-a); }
.tile.tier-b .tile-art { border-color: var(--tier-b); }""",
    """.tile.tier-sp .tile-art {
  border-color: color-mix(in srgb, var(--tier-sp) 55%, transparent);
}
.tile.tier-s .tile-art {
  border-color: color-mix(in srgb, var(--tier-s) 50%, transparent);
}
.tile.tier-a .tile-art {
  border-color: color-mix(in srgb, var(--tier-a) 40%, transparent);
}
.tile.tier-b .tile-art {
  border-color: color-mix(in srgb, var(--tier-b) 35%, transparent);
}""",
)

# rarity glow + foil sweep on high-tier owned tiles
s = s.replace(
    """/* owned tiles inherit the rarity glow */
.tile.tier-sp .tile-art {
  box-shadow: 0 0 22px -10px var(--tier-sp);
}

.tile.tier-s .tile-art {
  box-shadow: 0 0 18px -10px var(--tier-s);
}""",
    """/* owned tiles inherit the rarity glow */
.tile.tier-sp .tile-art {
  box-shadow:
    0 0 22px -10px var(--tier-sp),
    0 0 0 1px color-mix(in srgb, var(--tier-sp) 25%, transparent) inset;
}

.tile.tier-s .tile-art {
  box-shadow: 0 0 18px -12px var(--tier-s);
}

/* the S+ tile carries the same slow sweep as the card */
.tile.tier-sp .tile-art::after {
  content: "";
  position: absolute;
  inset: -30%;
  background: linear-gradient(
    115deg,
    transparent 44%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 56%
  );
  transform: translateX(-120%);
  animation: owned-sweep 5.5s ease-in-out infinite;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .tile.tier-sp .tile-art::after {
    animation: none;
  }
}""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tile outlines + rarity effects fixed")

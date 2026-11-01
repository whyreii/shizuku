import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

start = s.index(".chip {")
end = s.index(".card-bottom {")
old = s[start:end]

new = """.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  min-width: 32px;
  padding: 0 9px;
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0 2px,
      transparent 2px 5px
    ),
    rgba(12, 18, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--paper);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
  box-shadow: 0 5px 14px -9px #000;
  z-index: 2;
}

/* stitched edge, same language as the CLAIMED / WISH patches */
.chip::after {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 5px;
  pointer-events: none;
}

.tier-chip {
  color: var(--tier);
  border-color: color-mix(in srgb, var(--tier) 55%, transparent);
  transform: rotate(-4deg);
  transform-origin: left center;
}

.rank-chip {
  color: rgba(238, 244, 251, 0.94);
  letter-spacing: 0.04em;
  transform: rotate(3deg);
  transform-origin: right center;
}

"""

s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("chips look like stitched patches")

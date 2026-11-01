import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

old_chip_start = s.index(".chip {")
old_chip_end = s.index(".card-bottom {")
old_block = s[old_chip_start:old_chip_end]

new_block = """.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  min-width: 30px;
  padding: 0 9px;
  border-radius: 1px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: #0b1219;
  /* dashed edge reads as a perforated stamp at this size */
  border: 1px dashed rgba(255, 255, 255, 0.42);
  color: var(--paper);
  text-shadow: 0 0 1px currentColor, 0 1px 2px rgba(0, 0, 0, 0.7);
  box-shadow: 0 2px 8px -4px #000;
  z-index: 2;
}

.tier-chip {
  color: var(--tier);
  border-color: color-mix(in srgb, var(--tier) 70%, transparent);
  transform: rotate(-2.5deg);
}

.rank-chip {
  color: rgba(238, 244, 251, 0.92);
  letter-spacing: 0.06em;
  transform: rotate(1.8deg);
}

"""

s = s[:old_chip_start] + new_block + s[old_chip_end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("chips restyled as stamps")

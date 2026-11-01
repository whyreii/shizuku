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
  height: 21px;
  min-width: 30px;
  padding: 0 8px;
  border-radius: 7px;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(6, 11, 17, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--paper);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  box-shadow: 0 4px 12px -8px #000;
  z-index: 2;
}

.tier-chip {
  color: var(--tier);
  border-color: color-mix(in srgb, var(--tier) 55%, transparent);
  transform: rotate(-1.5deg);
}

.rank-chip {
  color: rgba(238, 244, 251, 0.94);
  letter-spacing: 0.04em;
  transform: rotate(1.5deg);
}

"""

s = s[:start] + new + s[end:]

# flags round a little more, so all card marks share one shape language
s = s.replace("  padding: 3px 7px;\n  border-radius: 2px;\n  border: 1px solid color-mix(in srgb, currentColor 50%, transparent);",
              "  padding: 3px 8px;\n  border-radius: 6px;\n  border: 1px solid color-mix(in srgb, currentColor 55%, transparent);")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("chips are rounded patches, banner removed")

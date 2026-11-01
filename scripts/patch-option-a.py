import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# --- buttons: chrome stays square and precise -------------------------------
old_buttons = """/* Roll / Claim read as sewn-on patches, like the card marks */
.controls .btn {
  position: relative;
  border-radius: 4px;
  background: rgba(6, 11, 17, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 5px 16px -12px #000;
  transform: rotate(-0.8deg);
}

.controls .btn:nth-child(2) {
  transform: rotate(0.8deg);
}

.controls .btn::after {
  content: "";
  position: absolute;
  inset: 3px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  pointer-events: none;
}

.controls .btn:hover:not(:disabled) {
  transform: rotate(-0.8deg) translateY(-1px);
}

.controls .btn:nth-child(2):hover:not(:disabled) {
  transform: rotate(0.8deg) translateY(-1px);
}

.controls .btn.primary {
  background: rgba(154, 217, 255, 0.1);
  border-color: color-mix(in srgb, var(--frost) 55%, transparent);
}
"""

new_buttons = """/* Controls are chrome: square, precise, no tilt. */
.controls .btn {
  border-radius: 3px;
  background: rgba(6, 11, 17, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.controls .btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.28);
}

.controls .btn.primary {
  background: rgba(154, 217, 255, 0.1);
  border-color: color-mix(in srgb, var(--frost) 55%, transparent);
}
"""

assert old_buttons in s
s = s.replace(old_buttons, new_buttons)

# --- chips: flat, aligned; tier = left colour bar, rank = bare mono ---------
old_chips = """/* perforated inner edge = postage stamp */
.chip::after {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1px dotted rgba(255, 255, 255, 0.28);
  border-radius: 1px;
  pointer-events: none;
}

.tier-chip {
  color: var(--tier);
  border-color: color-mix(in srgb, var(--tier) 60%, transparent);
  transform: rotate(-2.5deg);
}

.rank-chip {
  color: var(--paper);
  border-color: rgba(255, 255, 255, 0.26);
  letter-spacing: 0.04em;
  transform: rotate(2deg);
}
"""

new_chips = """.tier-chip {
  color: var(--tier);
  border-color: transparent;
  background: rgba(6, 11, 17, 0.72);
  padding-left: 11px;
  transform: none;
}

/* tier reads as a colour bar, not a sticker */
.tier-chip::before {
  content: "";
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 2px;
  border-radius: 1px;
  background: var(--tier);
}

.rank-chip {
  color: var(--paper);
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
  letter-spacing: 0.02em;
  padding: 0 2px;
  font-size: 10px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);
  transform: none;
}
"""

assert old_chips in s
s = s.replace(old_chips, new_chips)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("option A applied")

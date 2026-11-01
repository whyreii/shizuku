import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# hairline chrome everywhere
s = s.replace(
    """.modal {
  width: 100%;
  max-width: 460px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: #0b1219;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 30px 80px -30px #000;
  outline: none;
}""",
    """.modal {
  width: 100%;
  max-width: 460px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: #0b1219;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  box-shadow: 0 30px 80px -30px #000;
  outline: 0 solid transparent;
  outline-width: 0;
}

.modal:focus,
.modal:focus-visible {
  outline: 0 solid transparent;
  outline-width: 0;
}""",
)

s = s.replace(
    """.btn {
  flex: 1;
  padding: 11px 10px;
  border: 1px solid var(--line);""",
    """.btn {
  flex: 1;
  padding: 11px 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);""",
)

s = s.replace(
    """.btn.primary {
  border-color: var(--frost);""",
    """.btn.primary {
  border-color: color-mix(in srgb, var(--frost) 45%, transparent);""",
)

s = s.replace(
    """.ghost {
  font-family: var(--mono);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--line);""",
    """.ghost {
  font-family: var(--mono);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid rgba(255, 255, 255, 0.07);""",
)

s = s.replace(
    """.buy {
  flex: none;
  min-width: 70px;
  padding: 5px 8px;
  border: 1px solid var(--line);""",
    """.buy {
  flex: none;
  min-width: 70px;
  padding: 5px 8px;
  border: 1px solid rgba(255, 255, 255, 0.07);""",
)

s = s.replace(
    """.help-fab {
  position: fixed;""",
    """.help-fab {
  position: fixed;""",
)

# card flags: hairline, no dashed overlay
s = s.replace(
    """  padding: 3px 7px;
  border-radius: 2px;
  border: 1px solid currentColor;
  background: rgba(5, 9, 15, 0.82);""",
    """  padding: 3px 7px;
  border-radius: 2px;
  border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
  background: rgba(5, 9, 15, 0.82);""",
)

s = s.replace(
    """.card-flag::after {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  border-radius: 1px;
  pointer-events: none;
}""",
    """.card-flag::after {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  pointer-events: none;
}""",
)

# card frame: softer tier line
s = s.replace(
    """  border: 1px solid var(--tier);
  box-shadow: 0 22px 48px -24px #000;""",
    """  border: 1px solid color-mix(in srgb, var(--tier) 55%, transparent);
  box-shadow: 0 22px 48px -24px #000;""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("hairline outlines applied")

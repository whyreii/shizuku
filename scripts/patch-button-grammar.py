import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

start = s.find("/* Controls are chrome: square, precise, no tilt. */")
if start != -1:
    end = s.find(".btn.primary {", start)
    if end != -1:
        s = s[:start] + s[end:]

s += """

/* Controls share the card's grammar: soft radius, layered surface, hairline edge */
.controls .btn {
  border-radius: 14px;
  padding: 14px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015)),
    rgba(8, 12, 18, 0.9);
  box-shadow:
    0 14px 28px -22px #000,
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  color: var(--paper);
  letter-spacing: 0.14em;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    transform 0.12s ease,
    color 0.16s ease;
}

.controls .btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.24);
}

.controls .btn .timer {
  color: var(--muted);
  letter-spacing: 0.08em;
}

.controls .btn.primary {
  border-color: color-mix(in srgb, var(--frost) 42%, transparent);
  background:
    linear-gradient(180deg, rgba(154, 217, 255, 0.16), rgba(154, 217, 255, 0.05)),
    rgba(8, 12, 18, 0.9);
  color: var(--frost);
  box-shadow:
    0 16px 32px -24px rgba(154, 217, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.controls .btn.primary .timer {
  color: color-mix(in srgb, var(--frost) 70%, white 30%);
}

.controls .btn.claim.urgent {
  border-color: color-mix(in srgb, var(--signal) 55%, transparent);
  background:
    linear-gradient(180deg, rgba(255, 107, 147, 0.16), rgba(255, 107, 147, 0.04)),
    rgba(8, 12, 18, 0.9);
  color: var(--signal);
}

.controls .btn:disabled {
  opacity: 0.42;
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("buttons aligned with card grammar")

import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s += """

/* One button grammar across the app: soft radius, layered surface, hairline edge */
.btn,
.mini-link,
.ghost,
.buy,
.chip-btn {
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015)),
    rgba(8, 12, 18, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--paper);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    color 0.16s ease,
    transform 0.12s ease;
}

.btn:hover:not(:disabled),
.mini-link:hover:not(:disabled),
.ghost:hover:not(:disabled),
.buy:hover:not(:disabled),
.chip-btn:hover {
  border-color: rgba(255, 255, 255, 0.24);
}

/* filters stay visually quieter than actions */
.chip-btn {
  padding: 5px 10px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: none;
}

.chip-btn.on {
  color: var(--frost);
  border-color: color-mix(in srgb, var(--frost) 45%, transparent);
  background:
    linear-gradient(180deg, rgba(154, 217, 255, 0.14), rgba(154, 217, 255, 0.04)),
    rgba(8, 12, 18, 0.9);
}

/* small actions keep the language, lose the weight */
.ghost,
.mini-link {
  padding: 6px 11px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: none;
}

.ghost.active,
.ghost.on,
.mini-link.on {
  color: var(--frost);
  border-color: color-mix(in srgb, var(--frost) 45%, transparent);
}

/* the ledger rows and tower rows are rows, not buttons — keep them flat */
.ledger-row,
.tower-row .buy,
.badge-row {
  box-shadow: none;
}

.ledger-row {
  border-radius: 0;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--line-soft);
}

.badge-row {
  border-radius: 0;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--line-soft);
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("button grammar applied app-wide")

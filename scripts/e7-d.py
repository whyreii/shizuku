import io
p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()
s += """

/* settings: novelty + wish boost controls */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  font-family: var(--ui);
  font-size: 12px;
  color: var(--ink-fg, #eef4fb);
}

.setting-row .seg {
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 2px;
}

.setting-row .seg b {
  min-width: 26px;
  text-align: center;
  font-family: var(--mono);
  font-size: 12px;
}

.setting-row .seg-btn {
  min-width: 26px;
  height: 24px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: var(--muted);
  font-family: var(--ui);
  font-size: 12px;
  cursor: pointer;
}

.setting-row .seg-btn.on,
.setting-row .seg-btn:hover {
  background: rgba(154, 217, 255, 0.16);
  color: var(--frost);
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("styles added")
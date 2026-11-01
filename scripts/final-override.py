import io
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
s += """

/* final overrides - the earlier dock and head rules still win on source order */
.gf-dock-item {
  font-size: 11px;
  letter-spacing: 0.04em;
}

/* the album bar is short and local; the rarity bar is the full-width one */
.gf-bar {
  flex: 0 0 150px;
  height: 4px;
  margin-bottom: 0;
}

.gf-bar i {
  min-width: 6px;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("overrides appended")
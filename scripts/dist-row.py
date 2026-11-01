import io
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
s += """

/* the rarity mix is one row: a compact bar plus its numbers, so it stops
   competing with the album progress bar above it */
.gf-dist {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 11px 0 13px;
}
.gf-dist-bar {
  width: 196px;
  flex: none;
}
.gf-dist-legend {
  margin-top: 0;
  gap: 13px;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("rarity row compacted")
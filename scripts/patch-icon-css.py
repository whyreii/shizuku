import io
p = "src/styles.css"
css = io.open(p, encoding="utf-8").read()
css += """

/* ---------------- icons ---------------- */
/* One inline set, stroked in currentColor, so a glyph inherits its row's tone. */
.icon {
  flex: none;
  display: inline-block;
  vertical-align: -0.15em;
}

.numbers dt {
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-value {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.key-cue {
  display: flex;
  align-items: center;
  gap: 4px;
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(css)
print("icon styles appended")
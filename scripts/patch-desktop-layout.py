import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    '      <main className="table">\n',
    '      <main className="table">\n        <div className="col-stage">\n',
)
s = s.replace(
    '        <nav className="tabs">',
    '        </div>\n\n        <div className="col-panel">\n        <nav className="tabs">',
)
s = s.replace(
    "        </section>\n      </main>",
    "        </section>\n        </div>\n      </main>",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* desktop: card column + panel column */
@media (min-width: 1100px) {
  .table {
    display: grid;
    grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
    align-items: start;
    gap: 40px;
  }

  .col-stage {
    position: sticky;
    top: 92px;
  }

  .col-panel {
    align-items: stretch;
  }

  .col-panel .tabs,
  .col-panel .panel {
    width: 100%;
  }

  .col-panel .panel {
    min-height: 420px;
  }
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("two-column desktop layout applied")

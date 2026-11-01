import io, sys, os
sys.stdout.reconfigure(encoding="utf-8")

# card renders exactly what the roster stores
c = "src/components/Card3D.tsx"
t = io.open(c, encoding="utf-8").read()
t = t.replace('import { seriesTitle } from "../engine/text";\n', "")
t = t.replace("<div className=\"card-series\">{seriesTitle(character.series)}</div>",
              "<div className=\"card-series\">{character.series}</div>")
io.open(c, "w", encoding="utf-8", newline="\n").write(t)

s = io.open("src/styles.css", encoding="utf-8").read()
s = s.replace("""  font-size: 9px;
  letter-spacing: 0.02em;
  text-transform: none;""", """  font-size: 9.5px;
  letter-spacing: 0.02em;
  text-transform: none;""")
io.open("src/styles.css", "w", encoding="utf-8", newline="\n").write(s)

if os.path.exists("src/engine/text.ts"):
    os.remove("src/engine/text.ts")
print("series rendered verbatim; helper removed")
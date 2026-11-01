import io

p = "src/components/Card3D.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('import { rankValue } from "../engine/roster";\n', "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

p2 = "src/components/Panels.tsx"
t = io.open(p2, encoding="utf-8").read()
t = t.replace(
    'import { ROSTER, characterById, rankValue, seriesIndex } from "../engine/roster";',
    'import { ROSTER, characterById, seriesIndex } from "../engine/roster";',
)
io.open(p2, "w", encoding="utf-8", newline="\n").write(t)
print("unused imports removed")

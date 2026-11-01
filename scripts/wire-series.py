import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
if "SeriesSheet" not in s.split("\n")[0:40].__str__():
    s = s.replace(
        'import { CollectionView } from "./CollectionView";',
        'import { CollectionView } from "./CollectionView";\nimport { SeriesSheet } from "./SeriesSheet";',
    )
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

p2 = "src/App.tsx"
t = io.open(p2, encoding="utf-8").read()
t = t.replace(
    '{tab === "Series" ? <SeriesPanel state={state} /> : null}',
    '{tab === "Series" ? (\n            <SeriesPanel state={state} act={act} actUndo={actWithUndo} />\n          ) : null}',
)
io.open(p2, "w", encoding="utf-8", newline="\n").write(t)
print("wired")

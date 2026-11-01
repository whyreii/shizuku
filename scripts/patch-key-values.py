import io

# Card3D: show key-boosted value
p = "src/components/Card3D.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    'import { formatKakera } from "../engine/game";',
    'import { characterValueValue, formatKakera } from "../engine/game";',
)
s = s.replace(
    '<span className="card-value">◇ {formatKakera(rankValue(character.rank))}</span>',
    '<span className="card-value">◇ {formatKakera(characterValueValue(character.rank, keys))}</span>',
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# Panels: collection rows
p2 = "src/components/Panels.tsx"
t = io.open(p2, encoding="utf-8").read()
t = t.replace(
    'import {\n  collectionValue,',
    'import {\n  characterValueValue,\n  collectionValue,',
)
t = t.replace(
    "<span className='row-value'>{formatKakera(rankValue(char.rank))}</span>",
    "<span className='row-value'>\n        {formatKakera(characterValueValue(char.rank, keys))}\n      </span>",
)
io.open(p2, "w", encoding="utf-8", newline="\n").write(t)
print("values now include key bonuses")

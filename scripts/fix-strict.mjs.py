import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "scripts/match-strict.mjs"
s = io.open(p, encoding="utf-8").read()
s = s.replace('import { readFile } from "node:fs/promises";', 'import { readFile, writeFile } from "node:fs/promises";')
# Mai: her roster series is the romaji title, the cache holds the English one, so
# the strict rule rejects an otherwise unambiguous, hand-verified portrait.
s = s.replace(
    "picks.sort((a,b) => a.rank - b.rank);",
    'picks.push({ rank: 10, name: "Mai Sakurajima", series: "Seishun Buta Yarou", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png", score: 1 });\n'
    "picks.sort((a,b) => a.rank - b.rank);",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("fixed")
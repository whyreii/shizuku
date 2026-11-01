import io

p = "ROADMAP.md"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "| P12 | Performance - bundle split, windowed lists, image pipeline | ? |",
    "| P12 | Performance - bundle split, windowed lists, image pipeline | done |",
)
s = s.replace(
    "- Done: roster loads from `/public/roster-extra.json`; bundle 811 KB \u001a **291 KB**.",
    "- Done: roster loads from `/public/roster-extra.json`; bundle 811 KB -> 291 KB.",
)
s = s.replace(
    "- **Windowed lists** for the collection rows and series list (~30 rows mounted).",
    "- Done: windowed lists mount ~30 rows (725 series -> 28 rows).",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("cleaned")

import io

p = "ROADMAP.md"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "| P12 | **Performance** — image warm cache + prefetch (done), windowed lists (next) | ⏳ |",
    "| P12 | Performance — bundle split, windowed lists, image pipeline | ✅ |",
)
s = s.replace(
    "- Move `roster-extra.json` to `/public` and `fetch()` it once — the bundle is at\n  **811 KB** with 5,225 extras inlined; a full run would be ~5 MB.",
    "- Done: roster loads from `/public/roster-extra.json`; bundle 811 KB → **291 KB**.",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("roadmap updated")

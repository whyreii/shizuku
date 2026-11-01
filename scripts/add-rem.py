import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
picks = json.load(io.open("scripts/.preview-matched.json", encoding="utf-8"))
if not any(p["rank"] == 3 for p in picks):
    picks.append({"rank": 3, "name": "Rem", "series": "Re:Zero kara Hajimeru Isekai Seikatsu",
                  "image": "https://s4.anilist.co/file/anilistcdn/character/large/b88575-Ayu8UPDA8NS6.png"})
picks.sort(key=lambda p: p["rank"])
rows = ",\n".join('  { rank: %d, image: "%s" }' % (p["rank"], p["image"]) for p in picks)

p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
start = s.index("const PICKS: { rank: number; image: string }[] = [")
end = s.index("];", start) + 2
s = s[:start] + "const PICKS: { rank: number; image: string }[] = [\n" + rows + "\n];" + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("picks:", len(picks))
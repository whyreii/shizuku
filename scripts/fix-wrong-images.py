import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------- 1. preview data: authoritative ranks, no guessing --------------
picks = json.load(io.open("scripts/.preview-matched.json", encoding="utf-8"))
picks.append({"rank": 10, "name": "Mai Sakurajima", "series": "Seishun Buta Yarou",
              "image": "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png"})
picks.sort(key=lambda p: p["rank"])
rows = ",\n".join('  { rank: %d, image: "%s" }' % (p["rank"], p["image"]) for p in picks)

p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
start = s.index("const PICKS: { rank: number; image: string }[] = [")
end = s.index("];", start) + 2
s = s[:start] + "const PICKS: { rank: number; image: string }[] = [\n" + rows + "\n];" + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("preview picks:", len(picks))

# ---------- 2. app resolver: never guess on an ambiguous name --------------
f = "src/engine/images.ts"
t = io.open(f, encoding="utf-8").read()

old1 = """    if (series) {
      const bySeries = pool.find((hit) =>
        hit.series.some((title) => title && similar(title, series)),
      );
      if (bySeries?.image) return bySeries.image;
    }"""
new1 = """    if (series) {
      const bySeries = pool.find((hit) =>
        hit.series.some((title) => title && similar(title, series)),
      );
      if (bySeries?.image) return bySeries.image;
      // The name matched several different characters and none of them belongs
      // to this series. Guessing would put a stranger's face on the card, so
      // leave it empty and let the initial-letter fallback show instead.
      const distinct = new Set(pool.map((hit) => hit.image));
      if (distinct.size > 1) return null;
    }"""
if t.count(old1) != 1:
    print("MISS anilist block"); sys.exit(1)
t = t.replace(old1, new1)

old2 = """    const pool = jikan.filter((hit) => normalise(hit.name) === exactName);
    const pick = pool[0] ?? (series ? jikan.find((hit) =>
      (hit.anime ?? []).some((a) => a.title && similar(a.title, series)),
    ) : undefined);"""
new2 = """    const pool = jikan.filter((hit) => normalise(hit.name) === exactName);
    const bySeries = series
      ? jikan.find((hit) =>
          (hit.anime ?? []).some((a) => a.title && similar(a.title, series)),
        )
      : undefined;
    if (!bySeries && pool.length > 1) return null;
    const pick = bySeries ?? pool[0];"""
if t.count(old2) != 1:
    print("MISS jikan block"); sys.exit(1)
t = t.replace(old2, new2)
io.open(f, "w", encoding="utf-8", newline="\n").write(t)
print("resolver no longer guesses")
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")

picks = json.load(io.open("scripts/.preview-matched.json", encoding="utf-8"))
rows = ",\n".join(
    '  { rank: %d, image: "%s" }' % (p["rank"], p["image"]) for p in picks
)

p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
start = s.index("const PORTRAITS = [")
end = s.index("}).filter((entry): entry is Picked => entry !== null);") + len(
    "}).filter((entry): entry is Picked => entry !== null);"
)

block = """interface Picked {
  char: Character;
  portrait: string;
}

/**
 * Real roster characters, each paired with its own portrait. In production this
 * pairing comes from the build-time roster-images map; it is pinned here only so
 * the study is stable while that map is still being generated.
 */
const PICKS: { rank: number; image: string }[] = [
""" + rows + """
];

const PICKED: Picked[] = PICKS.map((pick): Picked | null => {
  const char = characterAtRank(pick.rank);
  if (!char) return null;
  return { char: { ...char, image: pick.image }, portrait: pick.image };
}).filter((entry): entry is Picked => entry !== null);"""

s = s[:start] + block + s[end:]

# the gear belongs in the icon set, not borrowed from the badge glyph
s = s.replace('<Icon name="badge" size={15} />', '<Icon name="gear" size={15} />')
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("preview data pinned:", len(picks), "characters")
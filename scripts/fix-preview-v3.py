import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# --- 1. portraits ride on the character, exactly like roster-images.json will
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
old = """const PICKED: Picked[] = RANKS.map((rank, i) => {
  const char = characterAtRank(rank);
  return char ? { char, portrait: PORTRAITS[i % PORTRAITS.length] } : null;
}).filter((entry): entry is Picked => entry !== null);"""
new = """// The portrait is attached to the character, the same way the build-time
// roster-images map will do it. Both Card3D and Tile read character.image, so
// the hero and its album tile always show the same art.
const PICKED: Picked[] = RANKS.map((rank, i) => {
  const char = characterAtRank(rank);
  if (!char) return null;
  const portrait = PORTRAITS[i % PORTRAITS.length];
  return { char: { ...char, image: portrait }, portrait };
}).filter((entry): entry is Picked => entry !== null);"""
if s.count(old) != 1:
    print("MISS picked"); sys.exit(1)
s = s.replace(old, new)

old2 = """              <Card3D
                character={hero.char}
                imageOverride={hero.portrait}
                revealKey={`${hero.char.id}-preview`}
              />"""
new2 = """              <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />"""
if s.count(old2) != 1:
    print("MISS card3d"); sys.exit(1)
s = s.replace(old2, new2)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- 2. the scrim is positioned, so it painted over the in-flow rows
c = "src/preview.css"
css = io.open(c, encoding="utf-8").read()
old3 = """.gf-top {
  display: flex;"""
new3 = """/* positioned backdrop sits in its own layer; the rows must sit above it */
.gf-top,
.gf-main,
.gf-dock { position: relative; z-index: 1; }

.gf-backdrop,
.gf-scrim { z-index: 0; }

.gf-top {
  display: flex;"""
if css.count(old3) != 1:
    print("MISS css"); sys.exit(1)
css = css.replace(old3, new3)
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("fixed")
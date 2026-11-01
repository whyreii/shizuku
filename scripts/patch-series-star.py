import io

p = "src/components/SeriesSheet.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    "  toggleWish,\n  wishCap,",
    "  toggleStarwish,\n  toggleWish,\n  wishCap,",
)

# remove the "wish all missing" button
s = s.replace(
    """          <button
            className="link"
            disabled={missingUnwished.length === 0 || full}
            onClick={wishAllUnwished}
          >
            wish all missing ({Math.min(missingUnwished.length, cap - state.wishes.length)})
          </button>
""",
    "",
)

# drop the now-unused helper
start = s.find("  const wishAllUnwished = () => {")
if start != -1:
    end = s.find("  };", start)
    if end != -1:
        s = s[:start] + s[end + len("  };\n\n") :]

# starwish control on every tile
s = s.replace(
    "            onToggle={() => {",
    "            onStar={() => act((st) => toggleStarwish(st, char.id))}\n            onToggle={() => {",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("starwish added, bulk wish removed")

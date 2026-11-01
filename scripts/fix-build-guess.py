import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "scripts/build-roster.mjs"
s = io.open(p, encoding="utf-8").read()
old = "    const pick = bySeries ?? (named.length ? named[0] : null);\n    return pick?.image?.large ?? null;"
new = """    if (bySeries) return bySeries.image?.large ?? null;
    // Ambiguous name and no series match: refuse rather than put a stranger's
    // face on the card. Only an unambiguous single candidate is accepted.
    const distinct = new Set(pool.map((hit) => hit.image?.large).filter(Boolean));
    if (distinct.size !== 1) return null;
    return [...distinct][0];"""
print("found:", s.count(old))
if s.count(old) != 1:
    sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("build script no longer guesses")
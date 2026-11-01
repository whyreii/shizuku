import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label); sys.exit(1)
    s = s.replace(old, new)

# tier list constant
rep("""const TIER_VAR: Record<Tier, string> = {""",
"""const TIERS: Tier[] = ["S+", "S", "A", "B", "C", "D"];

const TIER_VAR: Record<Tier, string> = {""", "TIERS")

# completion percentage
rep("""  const size = ROSTER_SIZE();""",
"""  const size = ROSTER_SIZE();
  const completion = (PICKED.length / Math.max(1, size)) * 100;""", "completion")

# series icon: three books on a shelf instead of a box with a line
rep("""  series: (
    <>
      <path d="M4.5 4.5h13a2 2 0 0 1 2 2v13h-13a2 2 0 0 1-2-2Z" />
      <path d="M4.5 4.5v15" />
    </>
  ),""",
"""  series: (
    <>
      <path d="M4.2 4.6h3.3v14.8H4.2z" />
      <path d="M9.4 4.6h3.3v14.8H9.4z" />
      <path d="M14.1 5.7l3.2-.9 3.5 14.1-3.2.9z" />
    </>
  ),""", "series icon")

# dock: group the items, note stays right
rep("""        {DOCK.map((label, i) => (
          <span key={label} className={`gf-dock-item ${i === 0 ? "on" : ""}`}>
            <svg viewBox="0 0 24 24" className="gf-dock-glyph" aria-hidden="true">
              {ICONS[label]}
            </svg>
            {label}
          </span>
        ))}""",
"""        <div className="gf-dock-nav">
          {DOCK.map((label, i) => (
            <span key={label} className={`gf-dock-item ${i === 0 ? "on" : ""}`}>
              <svg viewBox="0 0 24 24" className="gf-dock-glyph" aria-hidden="true">
                {ICONS[label]}
              </svg>
              {label}
            </span>
          ))}
        </div>""", "dock nav")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tsx done")
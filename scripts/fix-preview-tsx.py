import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.index("const DOCK = [")
end = s.index("export default function PreviewV3()")

block = """const ICONS: Record<string, ReactNode> = {
  album: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
    </>
  ),
  wishes: (
    <path d="M12 3.1l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.6l-5.6 2.9 1.1-6.3L2.9 9.8l6.3-.9Z" />
  ),
  badges: (
    <>
      <path d="M12 2.6 20.2 7.3v9.4L12 21.4 3.8 16.7V7.3Z" />
      <circle cx="12" cy="12" r="2.4" opacity=".6" />
    </>
  ),
  tower: (
    <>
      <path d="M4 20h16" />
      <path d="M6.5 20v-7h11v7" />
      <path d="M9 13V8.5h6V13" />
    </>
  ),
  loot: (
    <>
      <path d="M3.6 8.4h16.8v11.7H3.6Z" />
      <path d="M2.4 4.1h19.2v4.3H2.4Z" opacity=".55" />
      <path d="M12 4.1v16" opacity=".55" />
    </>
  ),
  series: (
    <>
      <path d="M4.5 4.5h13a2 2 0 0 1 2 2v13h-13a2 2 0 0 1-2-2Z" />
      <path d="M4.5 4.5v15" />
    </>
  ),
  log: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </>
  ),
};

const DOCK = ["album", "wishes", "badges", "tower", "loot", "series", "log"] as const;

"""

s = s[:start] + block + s[end:]

nav_start = s.index('      <nav className="gf-dock"')
nav_end = s.index("      </nav>") + len("      </nav>\n")
nav = """      <nav className="gf-dock" aria-label="Preview navigation">
        {DOCK.map((label, i) => (
          <span key={label} className={`gf-dock-item ${i === 0 ? "on" : ""}`}>
            <svg viewBox="0 0 24 24" className="gf-dock-glyph" aria-hidden="true">
              {ICONS[label]}
            </svg>
            {label}
          </span>
        ))}
        <span className="gf-dock-note">preview v3 · frame only, cards unchanged</span>
      </nav>
"""
s = s[:nav_start] + nav + s[nav_end:]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("PreviewV3 simplified")
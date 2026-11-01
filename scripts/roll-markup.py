import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

old = """          <button className="gf-roll">
            <span>Roll &nbsp;·&nbsp; 893 left</span>
          </button>

          <div className="gf-under">
            <span>
              <b>10/10</b> this hour
            </span>
            <span className="gf-claim">claim · 48s</span>
          </div>"""

new = """          <button className="gf-roll">
            <svg className="gf-roll-glyph" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.7-6.4" />
              <path d="M21 3.4v5.2h-5.2" />
            </svg>
            <span className="gf-roll-label">Roll</span>
            <span className="gf-roll-count">×893</span>
          </button>

          <div className="gf-under">
            <span className="gf-hour">
              <span className="gf-pips" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <i key={i} className="on" />
                ))}
              </span>
              this hour
            </span>
            <button className="gf-claim">Claim · 48s</button>
          </div>"""
if s.count(old) != 1:
    print("MISS roll block"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("markup done")